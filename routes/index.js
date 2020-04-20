/** 
 * /api/:route
 * 
 * @description: Index file for the /api route. Includes routers for sub-routes
 * 
 */

const express = require('express');

const router = express.Router();

const courses = require('./courses/courseRoutes');
const users = require('./users/userRoutes');

router.use("/courses", courses);
router.use("/users", users);

module.exports = router;