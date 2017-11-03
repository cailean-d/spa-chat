const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let roomSchema, rooms, room;

autoIncrement.initialize(database);

roomSchema = new Schema({
    title: {type: String,  default: null},
    pic: {type: String,  default: 'room.png'},
    owner: {type: String, required: true},
    users: {type: Array, required: true},
    date: {type: Date, default: Date.now}
});

roomSchema.plugin(autoIncrement.plugin, { model: 'rooms', field: 'id',  startAt: 1 });
rooms = database.model('rooms', roomSchema);
 
async function addRoom(owner, user){
    try {
        room = new rooms({ 
            owner: owner,
            users: [owner, user]
        });
        return await room.save(); 
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function findRoom(room){
    try {
        return await rooms.findOne({id : room});
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function deleteRoom(room){
    try {
        return await rooms.findOneAndRemove({id : room});
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function setPic(room, picture){
    try {
        return await rooms.findOneAndUpdate(
            {id: room}, 
            {pic: picture}, 
            { new: true })
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function setTitle(room, title){
    try {
        return await rooms.findOneAndUpdate(
            {id: room}, 
            {title: title}, 
            { new: true })
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function addUser(room, user){
    try {
        return await rooms.update(
            { id: room }, 
            { $push: 
                { users: user } 
            });
    } catch (error) {
        console.log(error);
        return error;
    }
}
async function deleteUser(room, user){
    try {
        return await rooms.update(
            { id: room }, 
            { $pull: 
                { users: user } 
            });
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports.addRoom = addRoom;
module.exports.findRoom = findRoom;
module.exports.deleteRoom = deleteRoom;
module.exports.deleteUser = deleteUser;
module.exports.addUser = addUser;
module.exports.setTitle = setTitle;
