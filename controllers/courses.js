const ErrorReponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/course');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all courses
// @route    GET  /api/v1/courses 
// @access   Public

exports.getAllCourses = asyncHandler(async(req,res,next)=>{
    let query;
    if(req.params.bootcampId){
        query = Course.find({bootcamp : req.params.bootcampId});
    } else {
        query =  Course.find().populate({
            path : 'bootcamp',
            select : 'name description'
        });

    }
    const courses = await query;
    
    res.status(200).send({
        success : true,
        count : courses.length,
        data : courses
    })
})

// @desc      Get single course
// @route     GET  api/v1/courses/:id
// access     public

exports.getCourse = asyncHandler(async(req,res,next)=>{
    const course = await Course.findById(req.params.id).populate({
        path : 'bootcamp',
        select : 'name description'
    })
    if(!course){
        return next(new ErrorReponse(`No course with the id ${req.params.id}`),404);
    }

    res.status(200).json({
        success : true,
        data : course
    })
})

// @desc    Add a Course
// @route   POST api/v1/bootcamps/:id/courses
// @access  Private
exports.addCourse = asyncHandler(async(req,res,next)=>{
    console.log(req.params.bootcampId);
    req.body.bootcamp = req.params.bootcampId;
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    
    if(!bootcamp) {
        return next(new ErrorReponse(`No Bootcamp find for given ID ${req.params.bootcampId}`),404);
    }

    const course = await Course.create(req.body);

    res.status(201).json({
        success : true,
        data : course
    })
})

// @desc    Update the course
// @route   PUT   api/v1/course/:id
// @access  Private

exports.updateCourse = asyncHandler(async(req,res,next)=>{
    let course = await Course.findById(req.params.id);

    if(!course) {
        return next(new ErrorReponse(`Course not found for the given ID ${req.params.id}`),404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new : true,
        runValidators : true
    })
    res.status(200).json({
        success : true,
        data : course
    })
})

// @desc   Delete Course By ID
// @route  DELETE  api/v1/course/:id
// @access Private
exports.deleteCourse = asyncHandler(async(req,res,next)=>{
    const course = await Course.findById(req.params.id);
    if(!course){
        return next(new ErrorReponse(`Course not found for the given ID ${req.params.id}`),404);
    }

    await Course.remove();
    res.status(200).json({
        success : true,
        data : {}
    })

})