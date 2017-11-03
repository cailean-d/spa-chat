const database = require('../database/friends');
const usersDatabase = require('../database/users');

function inviteFriend(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
    }

    database.inviteFriend(req.session.userid, req.params.id, (err, doc, affected) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(doc);
        }
    })
}

function addFriend(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Sender is required'}); 
    }

    database.addFriend(req.params.id, req.session.userid, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(doc);
        }
    })
}
    
function deleteFriend(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Sender is required'}); 
    }

    database.deleteFriend(req.session.userid, req.params.id, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(doc);
        }
    })
}

function rejectFriend(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Sender is required'}); 
    }

    database.rejectFriend(req.params.id, req.session.userid, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(doc);
        }
    })
}

function cancelInvite(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
    }

    database.rejectFriend(req.session.userid, req.params.id, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(doc);
        }
    })
}

function getFriends(req, res){
    database.getFriends(req.session.userid, (err, results) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            getListOfUsers(req, results, (users) => {
                res.status(200).json(users);
            })
        }
    })
}

function getInvites(req, res){
    database.getInvites(req.session.userid, (err, results) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            getListOfUsers(req, results, (users) => {
                res.status(200).json(users);
            })
        }
    })
}

function getInvitesCount(req, res){
    database.getInvitesCount(req.session.userid, (err, count) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(count);
        }
    })
}

function getFriendsCount(req, res){
    database.getFriendsCount(req.session.userid, (err, count) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else{
            res.status(200).json(count);
        }
    })
}

function getListOfUsers(req, results, callback){

    if(results.length == 0){
        return callback(null);
    }

    let friends =  [];

    for(let i = 0; i < results.length; i++){
        
        let element = results[i];
        let friend;
        
        if(req.session.userid == element.friend_1){
            friend = element.friend_2;
        } else {
            friend = element.friend_1;
        }
        usersDatabase.getUser(friend, function(err, doc){
            if (err){
                console.log(err.message);
                res.status(500).json({ status: 500, message: err.message}); 
            } else if (!doc){
                res.status(404).json({ status: 404, message: 'User not found'});
            } 
            else{
                friends.push({
                    id: doc.id,
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

                if( i === results.length - 1){
                    callback(friends);
                }
            }
        }) 

    }
}

function isFriend(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Id is required'}); 
    }

    database.isFriend(req.session.userid, req.params.id, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else if (!doc){
            res.status(404).json({ status: 404, message: false});
        } else {
            res.status(200).json({ status: 200, message: true});
        }
    })
}

function isInvited(req, res){

    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Id is required'}); 
    }

    database.isInvited(req.session.userid, req.params.id, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else if (!doc){
            res.status(404).json({ status: 404, message: false});
        } else {
            res.status(200).json({ status: 200, message: true});
        }
    })
}

function meIsInvited(req, res){
    if(!req.params.id){
        return res.status(400).json({ status: 400, message: 'Id is required'}); 
    }

    database.isInvited(req.params.id, req.session.userid, (err, doc) => {
        if (err){
            console.log(err.message);
            res.status(500).json({ status: 500, message: err.message}); 
        } else if (!doc){
            res.status(404).json({ status: 404, message: false});
        } else {
            res.status(200).json({ status: 200, message: true});
        }
    })
}



module.exports.inviteFriend = inviteFriend;    
module.exports.addFriend = addFriend;              
module.exports.deleteFriend = deleteFriend;        
module.exports.rejectFriend = rejectFriend;        
module.exports.getFriends = getFriends;
module.exports.getInvites = getInvites;
module.exports.getFriendsCount = getFriendsCount;
module.exports.getInvitesCount = getInvitesCount;
module.exports.isFriend = isFriend;
module.exports.isInvited = isInvited;
module.exports.meIsInvited = meIsInvited;
module.exports.cancelInvite = cancelInvite;