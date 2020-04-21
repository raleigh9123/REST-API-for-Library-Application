

// load modules
const express = require('express');
const morgan = require('morgan');
// Parse JSON data
const bodyParser = require('body-parser');
// Integrate project specific models through the sequelize cli entry point 'index.js'
const {sequelize} = require('./models');
// Include express routes 
const routes = require('./routes');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Authenticate and synchronize the SQL database. If validation errors exist, produce an error response.
// ** Note: {force:true} is not included in .sync() because database content already exists. Content should not be overwritten ** 
(async() => {
  try{
    await sequelize.authenticate();
    console.log('Connection to database successful');
    // If table does not exist in database, create one from model definitions
    await sequelize.sync();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      console.error('Validation errors: ', errors);
    } else {
      throw error;
    }
  }
})();


// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// Parse JSON data
app.use(bodyParser.json());
// Load routes for the api at the url path /api/:route
app.use('/api', routes);

// Include friendly greeting for the home route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

// Send 404 if no route is found
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Setup global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
