const database = require('../database/users');
const bcrypt = require('bcryptjs');       


function getUsers(req, res){

    let offset, limit;

    offset = req.query.offset ? Number(req.query.offset) : 0;
    limit = req.query.limit ? Number(req.query.limit) : 10;

    database.getUsers(offset, limit, function(err, docs){
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(docs);
        }
    });
}

function getUser(req, res){
    database.getUser(req.params.id, function(err, doc){
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else if (!doc){
            res.status(404).json({ status: 404, message: 'User not found'});
        } 
        else{
            res.status(200).json({
                nickname: doc.nickname,
                firstname: doc.firstname,
                lastname: doc.lastname,
                avatar: doc.avatar,
                gender: doc.gender,
                about: doc.about,
                birthday: doc.birthday,
                phone: doc.phone,
                website: doc.website,
                country: doc.country,
                city: doc.city,
                language: doc.language,
            });
        }
    })     
}

function getMyProfile(req, res){
    database.getUser(req.session.userid, function(err, doc){
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else if (!doc){
            res.status(404).json({ status: 404, message: 'User not found'});
        } 
        else{
            res.status(200).json(doc);
        }
    }) 
}



function updateUser(req, res){
    let data = req.body; 

    if(data.id){
        return res.status(400).json({ status: 400, message: 'You cannot change your id'}); 
    }
    if(data.date){
        return res.status(400).json({ status: 400, message: 'You cannot change your registration date'}); 
    }
    if(data.email){
        return res.status(400).json({ status: 400, message: 'You cannot change your email'}); 
    }

    if(data.password){

        database.getUser(req.session.userid, function(err, doc){
            if (err){
                console.log(err.message);
              return res.status(500).json({ status: 500, message: err.message}); 
            } else if (!doc){
                return res.status(404).json({ status: 404, message: 'User not found'});
            } 
            else{
                bcrypt.compare(data.oldpassword, doc.password, function(err, doesMatch){
                    if (err){
                        console.log(err.message);
                        return res.status(500).json({ status: 500, message: err.message}); 
                    } else if(!doesMatch){
                        return res.status(400).json({ status: 400, message: `Incorrect password`});
                    } else {
                         delete data.oldpassword;
                         bcrypt.hash(data.password, 8, function( err, bcryptedPassword) {
                            if(err){
                                console.log(err.message.message);
                                res.status(500).json({ status: 500, message: err.message}); 
                            } else {
                                update({password: bcryptedPassword}, req, res);
                            }
                        });
                    }
                  });
            }
        }) 
    } else {
        update (data, req, res);
    }
  
}

function update(data, req, res){
    database.updateUser(req.session.userid, data, function(err, doc){
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } 
        else if(!doc){
            res.status(404).json({ status: 404, message: `User not found!`});
        } 
        else{
            res.status(200).json({ status: 200, message: `User [${doc.id}] updated!`});
        }
    }) 
}

function deleteUser(req, res){
    database.getUser(req.session.userid, function(err, doc){
        if (err) {
            console.log(err);
           return res.status(500).json({ status: 500, message: err.message}); 
        } else if(!doc){
           return res.status(404).json({ status: 404, message: `User not found!`});
        } else if (req.params.id != req.session.userid){
           return res.status(400).json({ status: 400, message: 'You cannot delete another user'}); 
        } else {
            database.deleteUser(req.session.userid, function(err, doc){
                if (err){
                    console.log(err.message);
                    res.status(500).json({ status: 500, message: err.message}); 
                } else if(!doc){
                    res.status(404).json({ status: 404, message: `User not found!`});
                } else{
                    req.session.destroy();
                    res.status(200).json({ status: 200, message: `User [${doc.id}] deleted!`});
                }
            }) 
        }
    })
}

function getCount(req, res){
    database.getCount(function(err, count){
        if(err){
            console.log(err.message);
            res.status(500).json({ status: 404, message: err.message}); 
        } else {
            res.status(200).json(count);
        }
    });
}




module.exports.getUser = getUser;              
module.exports.updateUser = updateUser;        
module.exports.deleteUser = deleteUser;        
module.exports.getUsers = getUsers;
module.exports.getCount = getCount;
module.exports.getMyProfile = getMyProfile;
