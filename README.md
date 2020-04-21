# Full Stack JavaScript Techdegree - REST API Project
SQL Library Manager

 --Description
This project is a Rest API that configures responses to API requests for 'Courses' and 'Users' in a local database.


--Skills and Process
Skills: SQLite, Sequelize, bcryptjs, basic-auth, express validator, sequelize-cli, and Express
-
-
-
-To simplify the project

-This application demonstrates the following skills:
    1. Project was created via the terminal with npm init -y and configured to use express without the traditional 'front-end' overhead created via the express-generator tool.
    2. Sequelize environment configuration generated via the sequelize-cli tool, and configured to interact with a local database generated via npm run seed command.
    3. Two sequelize models defined and related: 'Course' and 'User'. These models define the tables in the database and the information that is manipulated within the project. Models contain sequelize validation information and table relationships.
    4. All routes are routed via app.js into /api/:routes and follow respective routes folders /api/users/:routes and /api/courses/:routes. These routes were separated to modularize the project and improve readability. Additionally, helper functions are included in helper.js to minimize repeated code within the routes files.
    5. Individual route files include all the routes for various HTTP requests to the API. GET, POST, PUT, and DELETE requests are all called from within the two route folders and correspond with sequelize CRUD operations.
    6. Routes include authentication and validation middleware to first authenticate users, then validate client data, and finally return responses via JSON. HTTP status codes are returned. Some routes may not warrant a JSON response.
    7. Error handling is included for routes that are not found, user authentication and permission failures, and general server errors. Additionally, error handling returns user friendly validation errors (either from express-validator and invalid input data, or from Sequelize refusing valid data, but incorrect inputs for table configuration).
    

--Project Attempt
Exceeds Expectations
-Project meets 'Exceeds Expectations' requirement. 
-Additional email address validations are added to the POST /api/users route. As a secondary validation, sequelize model is also configured to allow ONLY unique email addresses, thereby refusing duplicate emails.
-Ensure that a user can only edit and delete their own courses: Users are authenticated, then compared to the userId attribute of the current course. Only users who authored the course may update or remove that course.
-Sequelize GET endpoints filter properties: The default properties 'createdAt' and 'updatedAt' are removed from the responses via an {attributes: } object passed into the GET request. This object does not filter out attributes, but rather only includes specific attributes. Additionally, the User's 'password' is removed from view.

## Overview of the Provided Project Files

The following files exist in this project: 

* The `seed` folder contains a starting set of data for the database in the form of a JSON file (`data.json`) and a collection of files (`context.js`, `database.js`, and `index.js`) that can be used to create the app's database and populate it with data.
* The `app.js` file configures Express to serve a simple REST API. 
* The `nodemon.js` file configures the nodemon Node.js module, which we are using to run the REST API.
* The `package.json` file (and the associated `package-lock.json` file) contain the project's npm configuration, which includes the project's dependencies.
* The `RESTAPI.postman_collection.json` file is a collection of Postman requests that you can use to test and explore the REST API.

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.
```
npm install

```
Second, seed the SQLite database.
```
npm run seed
```
And lastly, start the application.
```
npm start
```
To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).
Test the API routes via Postman and the provided Postman requests in the `RESTAPI.postman_collection.json` (listed above).