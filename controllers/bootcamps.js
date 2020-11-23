const ErrorResponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');

// @desc     Get all bootcamps
// @route    GET  /api/v1/bootcamps 
// @access   Public
exports.getAllBootcamps = asyncHandler(async (req,res,next) => {
    let query; 

    //Copy req query
    const reqQuery = { ...req.query };

    //Fields to execute
    const removeFeilds = ['select','sort','page','limit'];

    //Loop over removeFields and remove them from reqQuery
    removeFeilds.forEach(param=> delete reqQuery[param]);

    //Create query string
    let queryStr = JSON.stringify(reqQuery);

    //Create operators ($gt,$gte,$lt,$lte)   
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match => `$${match}`);

    //Finding resourse
    query =  Bootcamp.find(JSON.parse(queryStr)).populate('courses');
     
    //Select Fields
    if(req.query.select){
        const fields =  req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    
    //Sort Fields
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();
    
    //Exectuting query
    const bootcamps = await query;

    //Pagination result
    const pagination = {};
    if(endIndex < total){
        pagination.next = {
            page : page + 1,
            limit
        }
    }
    if(startIndex>0){
        pagination.prev = {
            page : page - 1,
            limit
        }
    }

    res.status(200).
    json({ success : true, count : bootcamps.length, pagination : pagination, data : bootcamps });    
})


// @desc     Get single bootcamps
// @route    GET  /api/v1/bootcamps/:id
// @access   Public
exports.getSingleBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found of the id ${req.params.id}`,404));
    }
    res.status(200).send({
        success : true,
        data : bootcamp
    })
})

// @desc     Delete bootcamp
// @route    Delete  /api/v1/bootcamps/:id 
// @access   Public
exports.deleteBootcamp = asyncHandler(async(req,res,next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found of the id ${req.params.id}`,404));
    }
    bootcamp.remove();
    res.status(200).json({
        success : true,
        data : bootcamp
    })
})

// @desc     Create new bootcamp
// @route    POST  /api/v1/bootcamps 
// @access   Public
exports.createBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({
        success : true,
        data : bootcamp
    })    
})

// @desc     Update bootcamps
// @route    PUT  /api/v1/bootcamps/:id
// @access   Public
exports.updateBootcamp = asyncHandler(async (req,res,next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new : true,
        runValidators : true
    });
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found of the id ${req.params.id}`,404));
    }
    res.status(200).json({
        success : true,
        data : bootcamp
    });            
});


// @desc     Get a Bootcamp within radius
// @route    GET  /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private
