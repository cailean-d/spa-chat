const database = require('../database/users');

function uploadAvatar(req, res){

    if(!req.files.avatar){
      return  res.status(400).json({ status: 400, message: 'File was not uploaded!'}); 
    } else {
        let type = req.files.avatar.mimetype;
        let id = makeid();
        let fileType = getType(type);
        let filename = `${id}.${fileType}`;

        file = req.files.avatar;
        if(type.indexOf('jpeg') != -1 || type.indexOf('png') != -1){
            file.mv(`client/assets/img/avatar/${filename}`, function(err) {
                if (err){
                  return res.status(500).json({ status: 500, message: err}); 
                }
                 database.updateUser(req.session.userid, {avatar: filename}, function(err, doc){
                    if (err) return res.status(500).json({ status: 500, message: err}); 
                    res.status(200).json({ status: 200, message: `${filename}`}); 
                 })
              });
        } 
    }
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 20; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
 }

function getType(mimetype){
    if (mimetype.indexOf('jpeg') != -1 ){
        return "jpeg";
    } else if(mimetype.indexOf('png') != -1){
        return "png";
    }
}

module.exports.uploadAvatar = uploadAvatar;