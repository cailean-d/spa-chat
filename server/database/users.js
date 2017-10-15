const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let userSchema, users, user;

autoIncrement.initialize(database);

userSchema = new Schema({
    nickname: {type: String, required: true, unique: "nickname already exists"},
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    email: {type: String, required: true, unique : "email already exists"},
    password: {type: String, required: true},
    avatar: {type: String, default: 'default.jpg'},
    status: {type: String, default: 'offile'},
    gender: {type: String, default: null},
    about: {type: String, default: null},
    birthday: {type: Date, default: null},
    phone: {type: String, default: null},
    website: {type: String, default: null},
    country: {type: String, default: null},
    city: {type: String, default: null},
    language: {type: Array, default: null},
    date: {type: Date, default: Date.now}
});

userSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id',  startAt: 1 });
users = database.model('users', userSchema);
 
 
function registerUser(nickname, email, password, callback){

   user = new users({
        nickname: nickname,
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