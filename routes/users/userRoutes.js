/** 
 * /api/users/:route
 * 
 * @description: Route to handle all users content
 * 
 */
const express = require("express");

const router = express.Router();

// Load required packages
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
// Include Helper Functions 
const { asyncHandler, authenticateUser } = require('../helper');
// Include Users Sequelize Model
const { User } = require('../../models');

// Set the validations array to create a new user (using express-validator). 
// Additionally, certain fields are also validated within their respective Sequelize Model (e.g. only unique email address may be used. Otherwise, will throw sequelize constraint error. REQUIRED FOR EXCEEDS EXPECTATIONS. Check Sequelize User Model)
// ** NOTE: This validator includes a commented block for a passwordConfirmation field. This is not used within the project. ** 
const userValidations = [
    check('firstName')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a first name.'),
    check('lastName')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a last name'),
    check('emailAddress')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "email address"')
        .isEmail()
        .withMessage('Please provide a valid email address.'),
    check('password')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "password"')
        .isLength({ min: 8, max: 20 })
        .withMessage('Please provide a value for "password" that is between 8 and 20 characters in length'),
    // Password Confirmation custom validator
    // check('passwordConfirmation')
    //     .exists({ checkNull: true, checkFalsy: true })
    //     .withMessage('Please provide a value for "passwordConfirmation"')
    //     .custom((value, { req }) => {
    //       // Compare the `password` and `passwordConfirmation` fields to find match
    //       if (value && req.body.password && value !== req.body.password) {
    //         throw new Error('Ensure "password" and passwordConfirmation" match');
    //       }
    //       // If match continue to route handler
    //       return true;
    //     }),
];

// GET /api/users --> STATUS 200 - Returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    const authorizedUser = req.activeUser;
    const user = await User.findByPk(authorizedUser.id, { attributes: ['firstName', 'lastName', 'emailAddress'] }); 
    res.status(200).json(user);
}));

// POST /api/users --> STATUS 201 - Creates a user, sets the Location header to "/", and returns no content [Includes validation middleware]
router.post('/', [userValidations], asyncHandler(async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const messages = validationErrors.array().map(error => error.msg);
        // Return validation errors to the client.
        res.status(400).json({ validationErrors: messages });
    } else {
        try {
            // Once data is valid, take user data from request object, hash password, then create new user.
            const newUser = req.body; 
            newUser.password = bcryptjs.hashSync(newUser.password)
            await User.create(newUser);
            res.status(201).location('/').end();
        } catch(error) {
            // If Sequelize fails to create a new user (e.g. emailAddress must be unique), generate friendly error message
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const errors = error.errors.map(err => err.message);
                res.status(400).json({'Validation Errors': errors});
            } else {
                throw error;
            }
        }
    }
}));

module.exports = router;