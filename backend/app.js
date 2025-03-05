//IMPORTS
const express = require('express');
require('express-async-errors');
const routes = require('./routes');


//SECURITY IMPORTS
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');

//UTILITY IMPORTS
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const { ValidationError } = require('sequelize');


const isProduction = environment === 'production';

//EXPRESS APPLICATION
const app = express();

//MIDDLEWARES
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin"
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);


// ------------MIDDLEWARES MUST BE USED ABOVE THIS -------------

//ROUTES!!!
app.use(routes); 



// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    // title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    // stack: isProduction ? null : err.stack
  });
});

module.exports = app;