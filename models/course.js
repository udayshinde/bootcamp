const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title : {
        type : String,
        trim : true,
        required : [true, 'Plese add a course title']
    },
    description : {
        type : String,
        required : [true, 'Please add a descriptoin']
    },
    weeks : {
        type : String,
        required : [true, 'Please add a week']
    },
    tuition : {
        type : Number,
        required : [true, 'Please add a tution cost']
    },
    minimumSkill : {
        type : String,
        required : [true, 'Please add a minumum skill'],
        enum : ['beginner','intermediate','advanced']
    },
    scholarshipAvailable : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    bootcamp : {
        type : mongoose.Schema.ObjectId,
        ref : 'Bootcamp',
        required : true
    } 
});

module.exports = mongoose.model('Course',CourseSchema);