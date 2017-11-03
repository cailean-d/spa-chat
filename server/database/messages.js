const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const rooms = require('../database/rooms');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let messageSchema, messages, message;

autoIncrement.initialize(database);

messageSchema = new Schema({
    sender: {type: Number, required: true},
    message: {type: Number, required: true},
    room: {type: Number, required: true},
    status: {type: Number, default: 0},
    hidden: {type: Array},
    date: {type: Date, default: Date.now}
});

messageSchema.plugin(autoIncrement.plugin, { model: 'messages', field: 'id',  startAt: 1 });
messages = database.model('messages', messageSchema);
 
async function addMessage(sender, message, room){
    try {
        message = new messages({
            sender: sender,
            message: message,
            room: room
        });
        return await message.save();
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function readMessage(message_id, room){
    try {
        return await messages.findOneAndUpdate({
            $and:[
                {id: message_id}, 
                {room: room}, 
            ]}, 
            {status: 1}, {new: true})
    } catch (error) {
        console.log(error);
        return error;
    }
}


async function deleteMessage(user, message_id, room){
    try {
        return await messages.findOneAndRemove({
            $and:[
                {id: message_id}, 
                {sender: user}, 
                {room: room}
            ]
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function hideMessage(user, message_id, room){
    try {
        return await messages.findOneAndUpdate({
            $and:[
                {id: message_id}, 
                {room: room}
            ]}, 
            {$push: { hidden: user } }, {new: true})
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getMessages(user, room, offset, limit){
    try {
        return await messages.find({
            $and: [
            { room: room },
            { hidden: { $ne: user } 
        }]
        }).skip(offset).limit(limit).sort({date: -1})
        .exec();
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getMessage(message_id, room){
    try {
        return await messages.findOne({
            $and: [
                { room: room },
                { id: message_id}
            ]
        })
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getLastMessage(user, room){
    try {
        return await messages.findOne({
            $and: [
            { room: room },
            { hidden: { $ne: user } 
        }]
        }).sort({date: -1})
        .exec();
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function deleteMessagesFromRoom(room){
    try {
        return await messages.findAndRemove({room: room});
    } catch (error) {
        console.log(error);
        return error;
    }
}

 module.exports.addMessage = addMessage;
 module.exports.readMessage = readMessage;
 module.exports.deleteMessage = deleteMessage;
 module.exports.hideMessage = hideMessage;
 module.exports.deleteMessagesFromRoom = deleteMessagesFromRoom
 module.exports.getMessage = getMessage;
 module.exports.getMessages = getMessages;
 module.exports.getLastMessage = getLastMessage;
