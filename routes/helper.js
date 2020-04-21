/** 
 * Helper functions for the routes files
 * 
 * @description: File includes the asyncHandler and authenticateUser functions to simplify route code
 * Functions are exported via module.exports
 * 
 */

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

// Asynchronous Function Route Handler
function asyncHandler(callback) {
    return async(req,res,next) => {
        try{
            await callback(req,res,next);
        } catch(error) {
            res.status(500).send(error);
        }
    } 
}


// Custom Authentication Middleware
const authenticateUser = async(req, res, next) => {
    let message = null;
    // Parse user credentials from authorization header
    const credentials = auth(req);
    if(credentials) {
        // Use client's user information to check database for valid user
        const user = await User.findOne({
            where: {
            emailAddress: credentials.name}
        })
        // user => user.emailAddress === credentials.name
        if(user) {
            // Compare the auth credential's string with the hashed user password. Capture authenticated user
            const authenticatedUser = bcryptjs.compareSync(credentials.pass, user.password);
            if(authenticatedUser) {
                // Add new "Active User" to request object and pass to route handler as the currently logged in user.
                req.activeUser = user;
            } else {
                message = `Invalid login credentials for: ${credentials.name}. Please enter a valid email and password.`
            } 
        } else {
            message = `No user: ${credentials.name} found.`
        }
    } else {
        message = 'Auth header not found.'
    }
    if(message) {
        res.status(401).json({message: `Access denied: ${message}`})
    } else {
        next();
    }
};

module.exports = {asyncHandler, authenticateUser}