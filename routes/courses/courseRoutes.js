/** 
 * /api/courses/:route
 * 
 * @description: Route to handle all COURSES content
 * 
 */
const express = require("express");

const router = express.Router();

const {asyncHandler} = require('../helper')
const { Course } = require('../../models');


// GET /api/courses --> STATUS 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
    const allCourses = await Course.findAll();
    res.status(200).json(allCourses);
}));

// GET /api/courses/:id --> STATUS 200 - Returns a course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async (req, res) => {
    const singleCourse = await Course.findByPk(req.params.id);
    if(singleCourse) {
        res.status(200).json(singleCourse);
    } else {
        res.status(404).json({error:"No article found"})
    }
}));

// POST /api/courses --> STATUS 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/', asyncHandler(async (req, res) => {
    const newCourse = req.body;
    await Course.create(newCourse);
    res.status(201).end();
}));

// PUT /api/courses/:id --> STATUS 204 - Updates a course and returns no content
router.put('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(parseInt(req.params.id, 10))
    course.update(req.body);
    res.status(204).end();
}));

// DELETE /api/courses/:id --> STATUS 204 - Deletes a course and returns no content
router.delete('/:id', asyncHandler(async (req, res) => {
    const course = await Course.findByPk(parseInt(req.params.id, 10))
    await course.destroy();
    res.status(204).end();
}));

module.exports = router;