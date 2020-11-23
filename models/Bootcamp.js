const mongoose = require("mongoose");
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');
const course = require("./course");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    unique: true,
    maxlength: [50, "Name can not more than 50 characters"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
    maxlength: [500, "Name can not more than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number can not more than 10 characters"],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    //mongoose geo json
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    state: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Ratings must be at least 1"],
    max: [10, "Ratings must can not more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  toJSON : { virtuals : true },
  toObject : { virtuals : true }
});

//Create bootcamp slug from name
BootcampSchema.pre('save',function(next){
  this.slug = slugify(this.name, { lower : true });
  next(); 
})

//Geocode & create location field
BootcampSchema.pre('save', async function(next){
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type : 'Point',
    coordinates : [loc[0].longitude,loc[0].latitude],
    formattedAddress : loc[0].formattedAddress,
    street : loc[0].streetName,
    city : loc[0].city,
    state : loc[0].state,
    zipcode : loc[0].zipcode,
    country : loc[0].country,
  }
  //Do not save the address in DB
  this.address = undefined;
  next();
})

//Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre('remove',async function(next){
  console.log(`Courses being removed from bootcamp ${this._id}`);
   await this.model('Course').deleteMany({bootcamp : this._id});
   next();
})


//Reverse Populate with virtuals
BootcampSchema.virtual('courses',{
  ref : 'Course',
  localField : '_id',
  foreignField : 'bootcamp',
  justOne : false
})

module.exports = mongoose.model("Bootcamp", BootcampSchema);
