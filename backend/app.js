const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes');

const { environment }  =require('./config');
const isProduction = environment ==='production';

const app = express();  //initialize the express application
app.use(morgan('dev'));     //middleware for logging information
app.use(cookieParser());        //middleware for parsing cookies
app.use(express.json());        //middleware for JSON parsing

//security middleware
if (!isProduction) {
    //enable cors only in development
    app.use(cors());
}

//helmet helps set a variety of hearders to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

//Set the _csurf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

// ...
app.use(routes); //connect all routes

module.exports = app;
