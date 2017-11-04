const database = require('../database/friends');
const usersDatabase = require('../database/users');

async function inviteFriend(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
        }

        let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
        let userIsInvited = await database.isInvited(req.session.userid, req.params.id);
        let user = await usersDatabase.getUser(req.params.id);

        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        if(userIsFriend){
            return res.status(400).json({ status: 400, message: 'User is already your friend'}); 
        }

        if(userIsInvited){
            return res.status(400).json({ status: 400, message: 'User is already invited'}); 
        }

        await database.inviteFriend(req.session.userid, req.params.id);
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function addFriend(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Sender is required'}); 
        }

        let isInvited = await database.isInvited(req.params.id, req.session.userid);
        let user = await usersDatabase.getUser(req.params.id);
        
        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }
        
        if(!isInvited){
            return res.status(400).json({ status: 400, message: 'You are not invited by this user'}); 
        }

        await database.addFriend(req.params.id, req.session.userid);
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}
    
async function deleteFriend(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Sender is required'}); 
        }

        let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
        let user = await usersDatabase.getUser(req.params.id);

        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        if(!userIsFriend){
            return res.status(400).json({ status: 400, message: 'User is not your friend'}); 
        }
    
        await database.deleteFriend(req.session.userid, req.params.id);
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function rejectFriend(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Sender is required'}); 
        }

        let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
        let isInvited = await database.isInvited(req.params.id, req.session.userid);
        let user = await usersDatabase.getUser(req.params.id);
        
        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        if(userIsFriend){
            return res.status(400).json({ status: 400, message: 'User is already your friend'}); 
        }
        
        if(!isInvited){
            return res.status(400).json({ status: 400, message: 'You are not invited by this user'}); 
        }

        await database.rejectFriend(req.params.id, req.session.userid);
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function cancelInvite(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Receiver is required'}); 
        }

        let userIsFriend = await database.isFriend(req.session.userid, req.params.id);
        let userIsInvited = await database.isInvited(req.session.userid, req.params.id);
        let user = await usersDatabase.getUser(req.params.id);

        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        if(userIsFriend){
            return res.status(400).json({ status: 400, message: 'User is already your friend'}); 
        }

        if(!userIsInvited){
            return res.status(400).json({ status: 400, message: 'User is not invited'}); 
        }

        await database.rejectFriend(req.session.userid, req.params.id);
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getFriends(req, res){
    try {
        let friends_id =  await database.getFriends(req.session.userid);
        let friends = await getListOfUsers(req, res, friends_id);
        return res.status(200).json({ status: 200, message: "success", data: friends});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getInvites(req, res){
    try {
        let invites_id = await database.getInvites(req.session.userid);
        let invites = await getListOfUsers(req, res, invites_id);
        return res.status(200).json({ status: 200, message: "success", data: invites});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getInvitesCount(req, res){
    try {
        let invitesCount = await database.getInvitesCount(req.session.userid);
        return res.status(200).json({ status: 200, message: "success", data: invitesCount});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getFriendsCount(req, res){
    try {
        let friendsCount = await database.getFriendsCount(req.session.userid);
        return res.status(200).json({ status: 200, message: "success", data: friendsCount});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getListOfUsers(req, res, results){
    try {
        if(results.length == 0){
            return null;
        }
    
        let users =  [];
    
        for(element of results){
            let friend;
    
            if(req.session.userid == element.friend_1){
                friend = element.friend_2;
            } else {
                friend = element.friend_1;
            }
    
            let user = await usersDatabase.getUser(friend);
    
            if(!user){
               return res.status(400).json({ status: 400, message: 'User not found'});
            }
    
            users.push({
                id: doc.id,
                nickname: doc.nickname,
                avatar: doc.avatar,
                gender: doc.gender,
                country: doc.country,
                city: doc.city,
            });
        }
        return users;
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function isFriend(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Id is required'}); 
        }

        let user = await usersDatabase.getUser(req.params.id);
        
        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        let isfriend = await database.isFriend(req.session.userid, req.params.id);
        
        if(!isfriend){
            return res.status(400).json({ status: 400, message: false});
        }

        return res.status(200).json({ status: 200, message: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function isInvited(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Id is required'}); 
        }

        let user = await usersDatabase.getUser(req.params.id);
        
        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        let isfriend = await database.isInvited(req.session.userid, req.params.id);
        
        if(!isfriend){
            return res.status(400).json({ status: 400, message: false});
        }

        return res.status(200).json({ status: 200, message: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
}

async function meIsInvited(req, res){
    try {
        if(!req.params.id){
            return res.status(400).json({ status: 400, message: 'Id is required'}); 
        }

        let user = await usersDatabase.getUser(req.params.id);
        
        if(!user){
            return res.status(400).json({ status: 400, message: 'User doesnt exist'}); 
        }

        let isfriend = await database.isInvited(req.params.id, req.session.userid);
        
        if(!isfriend){
            return res.status(400).json({ status: 400, message: false});
        }

        return res.status(200).json({ status: 200, message: true});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error});
    }
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