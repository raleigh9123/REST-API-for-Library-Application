/** 
 * /api/:route
 * 
 * @description: Index file for the /api route. Includes routers for sub-routes
 * To consolidate the route information, this router includes two paths /courses/:route and /users/:route
 * 
 */

const express = require('express');

const router = express.Router();

const courses = require('./courses/courseRoutes');
const users = require('./users/userRoutes');

router.use("/courses", courses);
router.use("/users", users);

module.exports = router;