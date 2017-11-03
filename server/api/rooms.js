const database = require('../database/rooms');
const users = require('../database/users');
const messages = require('../database/messages');

async function getRooms(req, res){
    try {
        let user = users.getUser(req.session.userid);

        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        let rooms = user.rooms;
        let data = [];

        if(rooms.length == 0) return res.status(200).json({ status: 200, message: 'no rooms'});

        for(room_id of rooms){
            let room = await database.findRoom(room_id);

            if(!room){
                return res.status(400).json({ status: 400, message: "Room doesnt exist "}); 
            }

            let lastMessage = await messages.getLastMessage(req.session.userid, room_id);

            if(lastMessage){
                let sender = users.getUser(lastMessage.sender);

                if(!sender){
                    return res.status(400).json({ status: 400, message: "User doesnt exist "}); 
                }

                if(room.users.length > 2) {
                    data.push({
                        id: room.id,
                        title : room.title,
                        picture: room.pic,
                        message: lastMessage.message
                    });
                } else {
                    data.push({
                        id: room.id,
                        title : sender.nickname,
                        picture: sender.avatar,
                        message: lastMessage.message
                    });
                }
            }
        }

        return res.status(200).json({ status: 200, message: database});   
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});   
    }
}



async function getRoom(req, res){
    try {
        
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }

        let user = users.getUser(req.session.userid);

        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        let rooms = user.rooms;

        if(rooms.length == 0) return res.status(200).json({ status: 200, message: 'no rooms'});

        let room = await database.findRoom(req.params.room);

        if(!room){
            return res.status(400).json({ status: 400, message: "Room doesnt exist "}); 
        }

        let lastMessage = await messages.getLastMessage(req.session.userid, room_id);

        if(lastMessage){
            let sender = users.getUser(lastMessage.sender);

            if(!sender){
                return res.status(400).json({ status: 400, message: "User doesnt exist "}); 
            }

            if(room.users.length > 2) {
                return res.status(200).json({
                    id: room.id,
                    title : room.title,
                    picture: room.pic,
                    message: lastMessage.message
                });
            } else {
                return res.status(200).json({
                    id: room.id,
                    title : sender.nickname,
                    picture: sender.avatar,
                    message: lastMessage.message
                });
            }
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});   
    }
}


async function deleteRoom(req, res){
    try {
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }

        let room = database.findRoom(req.params.room);

        if(room.owner == req.session.userid){
            await database.deleteRoom(req.params.room);
            await messages.deleteMessagesFromRoom(req.params.room);
            res.status(200).json("success");           
        } else {
            return res.status(400).json({ status: 400, message: 'You cannot delete the room'}); 
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function addUserToRoom(req, res){
    try {
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }
        if(!req.params.user){
            return res.status(400).json({ status: 400, message: 'User is required'}); 
        }
        let room = await database.findRoom(req.params.room);

        if(!room.title){
            if(!req.body.title){
                return res.status(400).json({ status: 400, message: 'Title is required'}); 
            }
            await database.setTitle(req.params.room, req.body.title);
        }

        if(room.owner == req.session.userid){
            await database.addUser(req.params.room, req.params.user);
            await users.addRoom(req.params.room, req.params.user);
            res.status(200).json("success");           
        } else {
             return res.status(400).json({ status: 400, message: 'You cannot add users'}); 
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function deleteUserFromRoom(req, res){
    try {
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }
        if(!req.params.user){
            return res.status(400).json({ status: 400, message: 'User is required'}); 
        }
        
        let room =  database.findRoom(req.params.room);

        if(room.owner == req.session.userid){
           await database.deleteUser(req.params.room, req.params.user);
           await users.deleteRoom(req.params.room, req.params.user);
           res.status(200).json("success");           
        } else {
            return res.status(400).json({ status: 400, message: 'You cannot delete users'}); 
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getUsersFromRoom(req, res){
    try {
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }

        let room = await database.findRoom(req.params.room);

        if(!room){
            return res.status(400).json({status: 400, message: "Room not found"});
        }

        return res.status(200).json(room.users);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}


async function getOwner(req, res){
    try {
        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required'}); 
        }

        let room = database.findRoom(req.params.room);

        if(!room){
            return res.status(400).json({status: 400, message: "Room not found"});
        }

        return res.status(200).json(room.owner);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function openRoom(req, res) {
    try {
        if(!req.params.user){
            return res.status(400).json({ status: 400, message: 'User is required'}); 
        }

        let user1 = await users.getUser(req.session.userid);
        let user2 = await users.getUser(req.params.user);

        if(!user1 || !user2){
            return res.status(400).json({ status: 400, message: "User doesnt exist"}); 
        }

        let rooms = user1.rooms;

        if(rooms.length == 0) {
            return createRoom(req, res);
        }

        for(room_id of rooms){
            let room = await database.findRoom(room_id);
            let users = room.users;

            if(users.length == 2){
                if((users[0] == req.session.userid && users[1] == req.params.user)
                || (users[1] == req.session.userid && users[0] == req.params.user)){
                   return res.status(200).json({ status: 200, message: "success", data: doc.id});
                }
            } 
        }

        return createRoom(req, res);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function createRoom(req, res){
    try {
        let room = await database.addRoom(req.session.userid, req.params.user);
        await users.addRoom(room.id, req.session.userid);
        await users.addRoom(room.id, req.params.user);
        return res.status(200).json({ status: 200, message: "success", data: room.id});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

module.exports.getRooms = getRooms;
module.exports.deleteRoom = deleteRoom;
module.exports.addUserToRoom = addUserToRoom;
module.exports.deleteUserFromRoom = deleteUserFromRoom;
module.exports.getUsersFromRoom = getUsersFromRoom;
module.exports.getRoom = getRoom;
module.exports.getOwner = getOwner;
module.exports.openRoom = openRoom;