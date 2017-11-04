const database = require('../database/messages');
const rooms = require('../database/rooms');
const users = require('../database/users');

async function roomPermissions(req, res, callback){

    try {
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }

        let room = await rooms.findRoom(req.params.room);
        let user = await users.getUser(req.session.userid);

        if(!room){
           return res.status(400).json({ status: 400, message: 'Room doesnt exist'}); 
        }

        if(!user){
            return res.status(400).json({ status: 400, message: 'User not found'}); 
        }

        let rooms_id = user.rooms;
        
        if(rooms_id.indexOf(req.params.room) != -1){
            callback(room);
        } else {
            return res.status(400).json({ status: 400, message: 'You are not a member of this room'}); 
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function userData(req, res){
    try {
        let room = await rooms.findRoom(req.params.room);

        if(!room){
            return res.status(400).json({ status: 400, message: 'Room doesnt exist'}); 
        }

        let roomUsers = room.users;
        let userDataObj = {};

        for(user_id of roomUsers){
            let user = await users.getUser(user_id);

            if(!user){
                return res.status(400).json({ status: 400, message: 'User not found'}); 
            }
            
            if(!userDataObj[user_id]){
                userDataObj[user_id] = {
                    id: user.id,
                    nickname: user.nickname,
                    avatar: user.avatar
                }
            }
        }

        return userDataObj;

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function addMessage(req, res){
    try {
        if(!req.body.message){
            return res.status(400).json({ status: 400, message: 'Message is required'}); 
        }
        roomPermissions(req, res, (room) =>{
            let users = room.users;
            await database.addMessage(req.session.userid, req.body.message, req.params.room);   
            res.status(200).json({status: 200, message: "success"});
        })        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function readMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
        }

        roomPermissions(req, res, () => {
            await database.readMessage(req.params.message_id, req.params.room);
            res.status(200).json({status: 200, message: "success"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}


async function deleteMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
        }

        roomPermissions(req, res, () => {
            await database.deleteMessage(req.session.userid, req.params.message_id, req.params.room);
            res.status(200).json({status: 200, message: "success"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function hideMessage(){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
        }

        roomPermissions(req, res, () => {
            await database.hideMessage(req.session.userid, req.params.message_id, req.params.room);
            res.status(200).json({status: 200, message: "success"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function getMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
        }

        roomPermissions(req, res, () => {
            let message = database.getMessage(req.params.message_id, req.params.room);
            let user = users.getUser(message.sender);
            res.status(200).json({
                sender_id: message.sender,
                sender_nickname: user.nickname,
                sender_avatar: user.avatar,
                message: message.message,
                status: message.status
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function getMessages(req, res){
    try {
        roomPermissions(req, res, () => {
            let offset, limit, data = [];
            let users = userData(req, res);
            offset = req.query.offset ? Number(req.query.offset) : 0;
            limit = req.query.limit ? Number(req.query.limit) : 20;
            let messages = await database.getMessages(req.session.userid, 
                                                      req.params.room, 
                                                      offset, 
                                                      limit);
            for(message of messages){
                data.push({
                    message: message.message,
                    sender_id: message.sender,
                    sender_nickname: users[message.sender].nickname,
                    sender_avatar: users[message.sender].avatar,
                    status: message.status
                })
            }
            res.status(200).json(data);
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

module.exports.getMessage = getMessage;
module.exports.getMessages = getMessages;
module.exports.addMessage = addMessage;
module.exports.readMessage = readMessage;
module.exports.deleteMessage = deleteMessage;
module.exports.hideMessage = hideMessage;