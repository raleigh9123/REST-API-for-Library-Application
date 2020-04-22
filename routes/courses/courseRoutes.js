/** 
 * /api/courses/:route
 * 
 * @description: Route to handle all COURSES content
 * 
 */
const express = require("express");

const router = express.Router();

// Load required packages
const { check, validationResult } = require('express-validator');
// Include Helper Functions 
const { asyncHandler, authenticateUser } = require('../helper')
// Include Courses Sequelize Model
const { Course } = require('../../models');

// Set the validations array to create a new post (using express-validator). 
const postValidations = [
    check('title')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a title.'),
    check('description')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a description.'),
];

// GET /api/courses --> STATUS 200 - Returns a list of courses (including the user that owns each course)
router.get('/', asyncHandler(async (req, res) => {
    const allCourses = await Course.findAll({ attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded'] });
    res.status(200).json(allCourses);
}));

// GET /api/courses/:id --> STATUS 200 - Returns a course (including the user that owns the course) for the provided course ID
router.get('/:id', asyncHandler(async (req, res) => {
    const singleCourse = await Course.findByPk(req.params.id, { attributes: ['title', 'description', 'estimatedTime', 'materialsNeeded'] });
    if(singleCourse) {
        res.status(200).json(singleCourse);
    } else {
        res.status(404).json({error:"No article found"})
    }
}));

// POST /api/courses --> STATUS 201 - Creates a course, sets the Location header to the URI for the course, and returns no content [Includes validation and authentication middleware]
router.post('/', authenticateUser, [postValidations], asyncHandler(async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const messages = validationErrors.array().map(error => error.msg);
        // Return validation errors to the client.
        res.status(400).json({ validationError: messages });
    } else {
        try {
            // Once user is authenticated, and data is valid, capture course data from request object
            const newCourse = req.body;
            // If the JSON data did not include the user's id, add it to the course
            if(!newCourse.userId) {
                const userId = req.activeUser.id;
                // Pass current userId into new course to associate data relationship
                newCourse.userId = userId;
            }
            const courseRecord = await Course.create(newCourse);
            res.status(201).location(`/api/courses/${courseRecord.id}`).end();
        } catch (error) {
            // If Sequelize fails to create a new course, generate friendly error message
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({'Validation Error(s)': errors});
            } else {
                throw error;
            }
        }
    }
}));

// PUT /api/courses/:id --> STATUS 204 - Updates a course and returns no content
router.put('/:id', authenticateUser, [postValidations], asyncHandler(async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const messages = validationErrors.array().map(error => error.msg);
        // Return validation errors to the client.
        res.status(400).json({ validationErrors: messages });
    } else {
        // Once user is authenticated, find course by url parameter
        const course = await Course.findByPk(parseInt(req.params.id, 10))
        // If course exists, otherwise generate error (404 below)
        if(course) {
            // Check course permissions. Only course authors may edit the course. Otherwise forbid permissions (403 error below)
            if(course.userId === req.activeUser.id) {
                try {
                    await course.update(req.body);
                    res.status(204).end();
                } catch(error) {
                    // If Sequelize fails to update course, generate friendly error message
                    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeForeignKeyConstraintError') {
                        const errors = error.errors.map(err => err.message);
                        res.status(400).json({'Validation Error(s)': errors});
                    } else {
                        throw error;
                    }
                }
            } else {
                res.status(403).json({error: 'You do not have permission to modify this course.'})
            }
        } else {
            res.status(404).json({error: `No course ID: ${req.params.id}`});
        }
    }
}));

// DELETE /api/courses/:id --> STATUS 204 - Deletes a course and returns no content
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(parseInt(req.params.id, 10))
    // If course exists, otherwise generate 404 error below
    if(course) {
        // Check course permissions. Only course authors may delete the course. Otherwise forbid permissions (403 error below)
        if(course.userId === req.activeUser.id) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json({error: 'You do not have permission to remove this course.'})
        }
    } else {
        res.status(404).json({error: `No course ID: ${req.params.id}`});
    }
}));

module.exports = router;