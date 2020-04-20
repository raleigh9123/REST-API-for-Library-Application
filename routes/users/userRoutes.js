/** 
 * /api/users/:route
 * 
 * @description: Route to handle all users content
 * 
 */
const express = require("express");

const router = express.Router();

const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const { asyncHandler, authenticateUser } = require('../helper');
const { User } = require('../../models');

// GET /api/users --> STATUS 200 - Returns the currently authenticated user
router.get('/', authenticateUser, asyncHandler(async(req, res) => {
    const authorizedUser = req.activeUser;
    const user = await User.findByPk(authorizedUser.id, { attributes: ['firstName', 'lastName', 'emailAddress'] }); 
    res.status(200).json(user);
}));

// POST /api/users --> STATUS 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/', [
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
    check('passwordConfirmation')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "passwordConfirmation"')
        .custom((value, { req }) => {
          // Compare the `password` and `passwordConfirmation` fields to find match
          if (value && req.body.password && value !== req.body.password) {
            throw new Error('Ensure "password" and passwordConfirmation" match');
          }
          // If match continue to route handler
          return true;
        }),
], asyncHandler(async (req, res) => {
    // Attempt to get the validation result from the Request object.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Use the Array `map()` method to get a list of error messages.
        const messages = errors.array().map(error => error.msg);
        // Return validation errors to the client.
        res.status(400).json({ errors: messages });
    } else {
        const newUser = req.body; 
        newUser.password = bcryptjs.hashSync(newUser.password)
        await User.create(newUser);
        res.status(201).location('/').end();
    }
}));

module.exports = router;