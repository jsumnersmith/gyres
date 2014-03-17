var mongo = require("mongodb"),
    BasecampProject = require("../routes/BasecampProject.js"),
    config = require("config.js"),
    projects = require("../routes/projects.js").array,
    async = require("async");

// Define some of our db server language
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.pure().BSON,
    ObjectID = mongo.ObjectID;

// Config the db
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db(config.dbName, server);

var Database = function() {
  var self = this;
  self.db = db;
  self.collection = "projects";
}

Database.prototype = {

  // Fire this puppy up.
  init: function(){
    var self = this;
    self.openDb();
  },

  // Open this puppy up.
  openDb: function(){
    var self = this;
    self.db.open(err, db){
      if (err) {
        console.log("Oops. We couldn't connect to the DB.");
        console.log(err);
      } else {
        console.log("Connected to the database");
        self.db.collection(self.collection, {strict: true}, function(err, collection){
          if (err) {
            console.log("Oops. Couldn't access that collection");
          } else{
            self.getProjects(collection)
          }
        });
      }
    })
  },

  // A method for updating projects in the db.
  setProjects: function(collection){
    async.each(projects, function(project)){
      collection.update(project, {safe:true, upsert: true}, function(err, result) {
        if (err) {
          res.send({'error':'An error has occurred'});
        } else {
          //What do we do when we're finished
        }
      });
    }, callback(/* What do we do when it's done? */));
  },

}

module.exports = {
  db: database
}
