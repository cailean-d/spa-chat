const database = require('../database/users');
const room = require('../database/rooms');

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  
    return text;
 }

function getType(mimetype){
    if (mimetype.indexOf('jpeg') != -1 ){
        return "jpeg";
    } else if(mimetype.indexOf('png') != -1){
        return "png";
    }
}

async function uploadAvatar(req, res){
    try {
        if(!req.files.avatar){
          return  res.status(400).json({ status: 400, message: 'File was not uploaded!'}); 
        }

        let type = req.files.avatar.mimetype;
        let id = makeid();
        let fileType = getType(type);
        let filename = `${id}.${fileType}`;

        file = req.files.avatar;

        if(fileType != 'jpeg' || fileType != 'png'){
            return  res.status(400).json({ status: 400, message: 'Please upload jpeg or png image'}); 
        }

        await file.mv(`client/assets/img/avatar/${filename}`);
        await database.updateUser(req.session.userid, {avatar: filename});
        return res.status(200).json({ status: 200, message: "success"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function uploadRoomImage(req, res){
    try {
        if(!req.files.room_image){
            return res.status(400).json({ status: 400, message: 'File was not uploaded!'}); 
        }

        if(!req.params.room){
            return res.status(400).json({ status: 400, message: 'Room is required!'}); 
        }

        let room = await room.findRoom(req.params.room);
        let user = await database.getUser(req.session.userid);

        if(!room){
           return res.status(400).json({ status: 400, message: 'Room doesnt exist'}); 
        }

        if(!user){
            return res.status(400).json({ status: 400, message: 'User not found'}); 
        }

        let rooms_id = user.rooms;
        
        if(rooms_id.indexOf(req.params.room) == -1){
            return res.status(400).json({ status: 400, message: 'You are not a member of this room'}); 
        }

        let type = req.files.room_image.mimetype;
        let id = makeid();
        let fileType = getType(type);
        let filename = `${id}.${fileType}`;

        file = req.files.room_image;

        if(fileType != 'jpeg' || fileType != 'png'){
            return res.status(400).json({ status: 400, message: 'Please upload jpeg or png image'}); 
        }

        await file.mv(`client/assets/img/room_avatar/${filename}`);
        await room.setTitle(req.params.room, filename);
        return res.status(200).json({ status: 200, message: "success"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}


module.exports.uploadAvatar = uploadAvatar;
module.exports.uploadRoomImage = uploadRoomImage;