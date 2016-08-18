// CONSTANT VARIABLE, DON'T CHANGE
var jwt_secret = 'supercalifragilisticexpialidocious';
var mongo_url = process.env.MONGODB_URI ||
  'mongodb://localhost/mymdb_db';

// require mongoose, and connect it with the given url
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url)

// require installed modules
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var unless = require('express-unless');

// require express module
var express = require('express');
// run express
var app = express();

// set all the middlewares

// all middleware instantiations
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// express-jwt
app.use(
  expressJWT({
    secret: jwt_secret
  })
  .unless({
    path: [
      '/api/signup',
      '/api/login',
      {
        url: new RegExp('/api.*/', 'i'),
        methods: ['GET']
      }
      // '/login',
      // { url: new RegExp('/users.*/', 'i'), methods: ['PUT', 'GET']  }
    ]
  })
);

// let's set the routes to list all the movie

// Only render errors in development
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500).send('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// encapsulating my api routes
var api_routes = require('./config/routes');
app.use('/api', api_routes);

// listening to the port
// set up the port
var port = process.env.PORT || 5000;
app.set('port', port);
app.listen(app.get('port'), function() {
  console.log('running on port: ' + app.get('port'));
});

// exporting app for testing purposes
module.exports = app;
