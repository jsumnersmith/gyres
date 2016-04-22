var db = require('./db.js');

module.exports.getUser = function(query, callback){
  db.getUser(query, function(err, user){
    callback(err, user);
  });
};

exports.putUser = function(user, callback){
  db.putUser(user, function(err, user){
    callback(err, user);
  })
}
