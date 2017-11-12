const database = require('../database/messages');
const rooms = require('../database/rooms');
const users = require('../database/users');
const htmlspecialchars = require('htmlspecialchars');

async function roomPermissions(req, res){

    try {
        if(!req.params.room){
            return res.status(400).json({ 
                status: 400, 
                message: '-id- is required',
                data: null
            }); 
        }

        if(!/^\d+$/.test(req.params.room)){
            return res.status(400).json({ 
                status: 400, 
                message: "-id- must be a number",
                data: null
            });
        }

        req.params.room = Number(req.params.room);

        let room = await rooms.findRoom(req.params.room);
        let user = await users.getUser(req.session.userid);

        if(!room){
           return res.status(400).json({ 
               status: 400, 
               message: 'Room doesnt exist',
               data: null
            }); 
        }

        if(!user){
            return res.status(400).json({ 
                status: 400, 
                message: 'User not found', 
                data: null
            }); 
        }

        let rooms_id = user.rooms;
        
        if(rooms_id.indexOf(req.params.room) != -1){
            return room;
        } else {
            return false;
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

async function userData(req, res){
    try {
        let room = await rooms.findRoom(req.params.room);

        if(!room){
            return res.status(400).json({ 
                status: 400, 
                message: 'Room doesnt exist', 
                data: null
            }); 
        }

        let roomUsers = room.users;
        let userDataObj = {};

        for(user_id of roomUsers){
            let user = await users.getUser(user_id);

            if(!user){
                return res.status(400).json({ 
                    status: 400, 
                    message: 'User not found',
                    data: null
                }); 
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
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

async function addMessage(req, res){
    try {
        if(!req.body.message){
            return res.status(400).json({ 
                status: 400, 
                message: 'Message is required', 
                data: null
            }); 
        }
        
        if(req.body.message.length < 1 && req.body.message.length > 255){
            return res.status(400).json({ 
                status: 400, 
                message: "-message- 's length must be more then 1 and less then 255",
                data: null
            }); 
        }

        req.body.message = htmlspecialchars(req.body.message);

        let permissions = roomPermissions(req, res);

        if (!permissions){
            return res.status(400).json({ 
                status: 400, 
                message: 'You are not a member of this room',
                data: null
            }); 
        }

        let users = permissions.users;
        await database.addMessage(req.session.userid, req.body.message, req.params.room);   
        return res.status(200).json({status: 200, message: "success", data: null});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

async function readMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ 
                status: 400, 
                message: '-id- is required',
                data: null
            }); 
        }

        if(!/^\d+$/.test(req.params.message_id)){
            return res.status(400).json({ 
                status: 400, 
                message: "-id- must be a number",
                data: null
            });
        }

        req.params.message_id = Number(req.params.message_id);

        let permissions = roomPermissions(req, res);
        
        if (!permissions){
            return res.status(400).json({ 
                status: 400, 
                message: 'You are not a member of this room',
                data: null
            }); 
        }

        let message  = await database.getMessage(req.params.message_id, req.params.room);

        if(!message){
            return res.status(400).json({ 
                status: 400, 
                message: 'Message does not exist',
                data: null
            });
        }

        if(message.sender == req.session.userid){
            return res.status(400).json({ 
                status: 400, 
                message: 'You cannot read your own message',
                data: null
            });
        }

        await database.readMessage(req.params.message_id, req.params.room);
        return res.status(200).json({status: 200, message: "success", data: null});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}


async function deleteMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ 
                status: 400, 
                message: '-id- is required',
                data: null
            }); 
        }

        if(!/^\d+$/.test(req.params.message_id)){
            return res.status(400).json({ 
                status: 400, 
                message: "-id- must be a number",
                data: null
            });
        }

        req.params.message_id = Number(req.params.message_id);
        
        let permissions = roomPermissions(req, res);
        
        if (!permissions){
            return res.status(400).json({ 
                status: 400, 
                message: 'You are not a member of this room',
                data: null
            }); 
        }

        let message  = await database.getMessage(req.params.message_id, req.params.room);
        
        if(!message){
            return res.status(400).json({ 
                status: 400, 
                message: 'Message does not exist',
                data: null
            });
        }

        if(message.sender != req.session.userid){
            return res.status(400).json({ 
                status: 400, 
                message: 'You can delete only your own messages',
                data: null
            }); 
        }

        await database.deleteMessage(req.session.userid, req.params.message_id, req.params.room);
        return res.status(200).json({status: 200, message: "success", data: null});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

async function hideMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ 
                status: 400, 
                message: '-id- is required',
                data: null
            }); 
        }

        if(!/^\d+$/.test(req.params.message_id)){
            return res.status(400).json({ 
                status: 400, 
                message: "-id- must be a number",
                data: null
            });
        }

        req.params.message_id = Number(req.params.message_id);

        let permissions = roomPermissions(req, res);
        
        if (!permissions){
            return res.status(400).json({ 
                status: 400, 
                message: 'You are not a member of this room',
                data: null
            }); 
        }

        let message  = await database.getMessage(req.params.message_id, req.params.room);
        
        if(!message){
            return res.status(400).json({ 
                status: 400, 
                message: 'Message does not exist',
                data: null
            });
        }

        await database.hideMessage(req.session.userid, req.params.message_id, req.params.room);
        return res.status(200).json({status: 200, message: "success", data: null});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

async function getMessage(req, res){
    try {
        if(!req.params.message_id){
            return res.status(400).json({ 
                status: 400, 
                message: '-id- is required',
                data: null
            }); 
        }

        if(!/^\d+$/.test(req.params.message_id)){
            return res.status(400).json({ 
                status: 400, 
                message: "-id- must be a number",
                data: null
            });
        }

        req.params.message_id = Number(req.params.message_id);

        let permissions = roomPermissions(req, res);
        
        if (!permissions){
            return res.status(400).json({ 
                status: 400, 
                message: 'You are not a member of this room',
                data: null
            }); 
        }

        let message  = await database.getMessage(req.params.message_id, req.params.room);
        
        if(!message){
            return res.status(400).json({ 
                status: 400, 
                message: 'Message does not exist', 
                data: null
            });
        }

        let user = await users.getUser(message.sender);

        res.status(200).json({
            status: 200, 
            message: "success", 
            data: {
                sender_id: message.sender,
                sender_nickname: user.nickname,
                sender_avatar: user.avatar,
                message: message.message,
                status: message.status
            }
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

async function getMessages(req, res){
    try {
        let permissions = roomPermissions(req, res);
        
        if (!permissions){
            return res.status(400).json({ 
                status: 400, 
                message: 'You are not a member of this room',
                data: null
            }); 
        }

        if(req.query.offset && !/^\d+$/.test(req.query.offset)){
            return res.status(400).json({ 
                status: 400, 
                message: "-offset- must be a number",
                data: null
            }); 
        }

        if(req.query.limit && !/^\d+$/.test(req.query.limit)){
            return res.status(400).json({ 
                status: 400, 
                message: "-limit- must be a number",
                data: null
            }); 
        }
        
        let offset, limit, data = [];
        let users = await userData(req, res);
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

        if(data.length > 0){
            return res.status(200).json({ 
                status: 200, 
                message: "success", 
                data: data
            });
        }

        return res.status(200).json({ status: 200, message: "success", data: null});
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error, data: null});
    }
}

module.exports.getMessage = getMessage;
module.exports.getMessages = getMessages;
module.exports.addMessage = addMessage;
module.exports.readMessage = readMessage;
module.exports.deleteMessage = deleteMessage;
module.exports.hideMessage = hideMessage;