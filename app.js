// constant variable, dont change
var mongo_url = process.env.MONGO_URI || 'mongodb://localhost/mymdb_db';
var jwt_secret = 'super123456789';

//require mongoose and connect it with the given url
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongo_url);


// require installed modules
// (bodyParser required to render data as JSON)
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');


// starting the server

// require express module
var express = require('express');
//run express (app is the only global variable)
var app = express();

//set up the port
var port = process.env.PORT || 5000;
app.set( 'port', port );


//set all the middlewares

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// express-jwt
app.use
( expressJWT({
    secret: jwt_secret
  })
  .unless({
    path: [ '/signup', '/login']
  })
);


//Movie MDB API MODELS LIST

//require the Movie, Actor and User modules
var Movie = require('./models/movie');
var Actor = require('./models/actor');
var User = require('./models/user');


// signup & login routes------------------------------------------------------//

app.post('/signup', function(req, res) {
  // res.send('create new user');

//set var for the posted request
  var user_object = req.body;

// set new user object
  var new_user = new User(user_object);

//save the new user object
new_user.save( function(err, user) {
  if (err) return res.status(400).send(err);

  return res.status(200).send({
    message: 'User created'
    });
  });
});

app.post('/login', function(req, res) {
  var loggedin_user = req.body;

  User.findOne(
    loggedin_user,
    function(err, found_user) {
      // this is error find flow
      if (err) return res.status(400).send(err);

      if(found_user) {
        var payload = {
          id: found_user.id,
          email: found_user.email
        };
        var expiryObj = {
          exp: 60 * 3
        };
        var jwt_token = jwt.sign(payload, jwt_secret, { expiresIn : 60*3 });

        return res.status(200).send(jwt_token);
      } else {
        // this is login failed flow
        return res.status(400).send({ message: 'login failed'});
      }
    });
  });


  //let's set the routes to list all the movies  -------------------------------//

    app.route('/movies')
       .get( function(req, res) {                    //list all the movies
        Movie.find({}).exec(function (err, movies) {
          if (err) res.status(400).send(err);
                res.json(movies);

        });
      })
      .post( function(req, res, next) {                //add new movies
        // console.log(req.body);
        var new_movie = new Movie(req.body);

        new_movie.save(function(err) {
          if (err) return res.status(400).send(err);

          res.json(new_movie);
        });
      });


      app.route('/movies/:movie_id')
         .get( function(req, res, next) {          //find movie by id
           var movie_id = req.params.movie_id;    //params is a json object

           Movie.findOne({
             _id: movie_id
           }, function(err, movie) {
             if (err) return next(err);

             res.json(movie);
           });
         })
         .put (function(req, res, next){         //update movie details by id
          // console.log(req.body);
           var movie_id = req.params.movie_id;

           Movie.findByIdAndUpdate( movie_id, req.body, function(err, movie) {
             if (err) return next (err);

             res.json(movie);
           });
         })
         .delete (function(req, res, next){       //delete movie by id
           var movie_id = req.params.movie_id;

           Movie.findByIdAndRemove( movie_id, req.body, function(err, movie) {
             if (err) return next (err);
            //  console.log('Movie deleted!');
            res.json(movie);

           });
         });




//let's set the routes for actors --------------------------------------------//

app.route('/actors')                             //list all the actors
   .get( function(req, res) {
    Actor.find({}).exec(function (err, actors) {
      if (err) res.status(400).send(err);
            res.json(actors);

    });
  })
  .post( function(req, res, next) {             //add new actors
    var new_actor = new Actor(req.body);

    new_actor.save(function(err) {
      if (err) {
        var err_message = {
          "message": err.errors.email.message,
          "status_code": 400
        };

        return res.status(400).send(err);
      }

      res.json(new_actor);
    });
  });


  app.route('/actors/:actor_id')
     .get( function(req, res, next) {
       res.json(req.actor);
    // refactoring the queries by param

    // var actor_id = req.params.actor_id;
    // Actor.findOne({
    //   _id: actor_id
    // }, function(err, actor) {
    //   if(err) res.status(400).send(err);
    //
    //   res.json(actor);
    // }
    // );
     })
     .put (function(req, res, next){         //update actor details by id
      // console.log(req.body);
       var actor_id = req.actor.id;

       Actor.findByIdAndUpdate( actor_id, req.body, function(err, actor) {
         if (err) res.status(400).send(err);
         Actor.findOne({
           _id: actor_id
         }, function(err, actor) {
           res.json(actor);
         });
       });
     })
     .delete (function(req, res, next){
        // if (err) res.status(400).send(err);
        // res.json(req.actor);

       var actor_id = req.params.actor_id;
       Actor.findByIdAndRemove( actor_id, req.body, function(err, actor) {
         if (err) res.status(400).send(err);
        res.json(actor);
       });

     });

     app.param('actor_id', function(req, res, next, actor_id){
       Actor.findOne({
    _id: actor_id
  }, function(err, actor) {
    if (err) res.status(400).send(err);

    req.actor = actor;
    next();
  });
});

// listening to the port
app.listen(app.get('port'), function() {
  console.log('running on port: ' + app.get('port') );
});
