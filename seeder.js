const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load Models
const bootcamp = require("./models/Bootcamp");
const course = require("./models/Course");

const { dirname } = require("path");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//Read Json Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

//Import int DB
const importData = async () => {
  try {
    await bootcamp.create(bootcamps);
    await course.create(courses);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

//Delete data
const deleteData = async () => {
  try {
    await bootcamp.deleteMany();
    await course.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
