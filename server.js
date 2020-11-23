const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load env vars 
dotenv.config({path : './config/config.env'});

//Connect To Database
connectDB();

//LOAD ROUTER
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');


const app = express();

//Body Parser
app.use(express.json());

//Load Middleware @Logger
//const logger = require('./middleware/logger');

//Load inbuilt middleware @morgan
//Dev logging middleware
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));
}


//app.use(logger);

//MOUNT ROUTES
app.use("/api/v1/bootcamps",bootcamps)
app.use("/api/v1/courses",courses);

//Load error middleware
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
})


//Handle unhandled promise rejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error : ${err.message}`);
    //Close server and exit process
    server.close(()=>process.exit(1));
})