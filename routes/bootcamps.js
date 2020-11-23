const express = require('express');

//Include other resource router
const courseRouter = require('./courses');

const router = express.Router();   

//Re-route into other resource router
router.use('/:bootcampId/courses',courseRouter);

const { 
    getAllBootcamps,
    getSingleBootcamp,
    deleteBootcamp,
    createBootcamp,
    updateBootcamp
    } = require('../controllers/bootcamps');   


router.route("/").get(getAllBootcamps).post(createBootcamp);

router.route("/:id").get(getSingleBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;