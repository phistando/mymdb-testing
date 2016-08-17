//mongodb://username:password@host:port/db
//localhost so no need username/password and localhost:27017
//instead use mymdb

// // not require, already connect at app.js
// var mongo_url = 'mongodb://localhost/mymdb_db';
// mongoose.connect(mongo_url);

var mongoose = require('mongoose');


//set the schema (mongoose is an object)
//setting up how json structure would be like
var movieSchema = new mongoose.Schema({
  title: {
    type: String,          //predefined modifier
    trim: true
  },
  publishedYear: Number,
  director: String,
  actor: String,
  published: {
    type: String,
    default: "MGM"
  },
  website: {
    type: String,
    trim: true,
    set: function(url) {
      if(! url) return url;
      if(
        url.indexOf('http://') !== 0 &&
        url.indexOf('https://') !== 0
      ) {
        url = 'http://' + url;
      }
      return url;
    }
  },
  created_at: {
    type: Date,
    default: Date.now  //default value
  }
});

//register the getter and virtuals modifier
movieSchema.set('toJSON', { getters: true, virtuals: true});

//register the Schema (if not, dunno wat movie is related to db)
//('Movie' -- db.movies, Movie is a constructor)
var Movie = mongoose.model('Movie', movieSchema);

// make this available to our other files
module.exports = Movie;
