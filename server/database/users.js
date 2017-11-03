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
    rooms: {type: Array, default: null},
    deleted: {type: Boolean, default: false},
    date: {type: Date, default: Date.now}
});

userSchema.plugin(autoIncrement.plugin, { model: 'users', field: 'id',  startAt: 1 });
users = database.model('users', userSchema);
 
 
async function registerUser(nickname, email, password){
    try {
        user = new users({
            nickname: nickname,
            email: email,
            password: password,
       });
       return await user.save();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}
 
async function deleteUser(id){
    try {
        return await users.findOneAndUpdate({id : id}, {$set: {deleted: true}}, { new: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});  
    }
}

async function restoreUser(id) {
    try {
        return await users.findOneAndUpdate({id : id}, {$set: {deleted: false}}, { new: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});  
    }
}


async function getUser(id){
    try {
        return await users.findOne({id : id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getUserByEmail(email){
    try {
        return await users.findOne({email : email});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});   
    }
}

async function updateUser(id, data){
    try {
        return await users.findOneAndUpdate({id : id}, {$set:data}, { new: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getUsers(offset, limit){
    try {
        return await users.find({}).skip(offset).limit(limit).exec();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getCount(){
    try {
        return await users.count({});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function addRoom(room, user){
    try {
        return await users.update(
            { id: user }, 
            { $push: { rooms: room } 
        });  
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function deleteRoom(room, user){
    try {
        return await users.update(
            { id: user }, 
            { $pull: { rooms: room } 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

 module.exports.registerUser = registerUser;    
 module.exports.getUser = getUser;              
 module.exports.updateUser = updateUser;        
 module.exports.deleteUser = deleteUser;        
 module.exports.getUsers = getUsers;
 module.exports.getCount = getCount;
 module.exports.getUserByEmail = getUserByEmail;
 module.exports.addRoom = addRoom;
 module.exports.deleteRoom = deleteRoom;
 module.exports.restoreUser = restoreUser;