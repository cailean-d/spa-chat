const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let userSchema, users, user;

autoIncrement.initialize(database);

userSchema = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, required: true, unique : "email already exists"},
    password: {type: String, required: true},
    gender: {type: String, default: null},
    date: {type: Date, default: Date.now}
});

userSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id',  startAt: 1 });
users = database.model('users', userSchema);
 
 
function registerUser(firstname, lastname, email, password, callback){

   user = new users({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
   });
 
   user.save(function(err, doc, affected){
       callback(err, doc, affected);
   });
}
 
function deleteUser(id, callback){
    users.findOneAndRemove({id : id},  function (err, doc){
        callback(err, doc);
    });
}


function getUser(id, callback){
    users.findOne({id : id},  function (err, doc){
        callback(err, doc);
    });
}

function getUserByEmail(email, callback){
    users.findOne({email : email},  function (err, doc){
        callback(err, doc);
    });
}

function updateUser(id, data, callback){
    users.findOneAndUpdate({id : id}, {$set:data}, { new: true }, function(err, doc){
        callback(err, doc);
    })
}

function getUsers(offset, limit, callback){
    users.find({}).skip(offset).limit(limit)
    .exec(function(err, docs) {
         callback(err, docs);
    });
}

function getCount(callback){
    users.count({}, function (err, count) {
        callback(err, count);
    });
}

 module.exports.registerUser = registerUser;    // C
 module.exports.getUser = getUser;              // R
 module.exports.updateUser = updateUser;        // U 
 module.exports.deleteUser = deleteUser;        // D
 module.exports.getUsers = getUsers;
 module.exports.getCount = getCount;
 module.exports.getUserByEmail = getUserByEmail;