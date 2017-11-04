const mongoose = require('mongoose');

let database = mongoose.connection;
let Schema = mongoose.Schema;
let friendSchema, friends, friend;


friendSchema = new Schema({
    friend_1: {type: String, required: true},
    friend_2: {type: String, required: true},
    status: {type: String, default: 0},
    date: {type: Date, default: Date.now}
});

friends = database.model('friends', friendSchema);
 
async function inviteFriend(sender, receiver){
    try {
        friend = new friends({
            friend_1: sender,
            friend_2: receiver,
        });
       return await friend.save();
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function addFriend(sender, receiver, callback){
    try{
        return await friends.findOneAndUpdate({
            $and:[ 
                {friend_1: sender}, 
                {friend_2: receiver}
            ]}, 
            {status: 1}, { new: true });
    } catch (error) {
        console.log(error);
        return error;
    }
}
 
async function deleteFriend(sender, receiver){
    try {
        return await friends.findOneAndRemove({
            $or: [
                { $and: [{friend_1: sender}, {friend_2: receiver}] },
                { $and: [{friend_1: receiver}, {friend_2: sender}] }
            ]
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function rejectFriend(sender, receiver){
    try {
        return await friends.findOneAndRemove({
            $and:[ 
                {friend_1: sender}, 
                {friend_2: receiver}, 
                {status: 0}
            ]});
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getFriends(id){
    try {
        return await friends.find({
            $and: [
                { $or: [{friend_1: id}, {friend_2: id}] },
                { status: 1 }
            ]
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getInvites(id){
    try {
        return await friends.find({ 
            $and: [ 
                { friend_2: id }, 
                { status: 0 }
            ]});
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getInvitesCount(id){
    try {
        return await friends.count({ 
            $and: [ 
                { friend_2: id }, 
                { status: 0 }
            ]});
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getFriendsCount(id){
    try {
        return await friends.count({
            $and: [
                { $or: [{friend_1: id}, {friend_2: id}] },
                { status: 1 }
            ]
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function isFriend(user1, user2){
    try {
        return await friends.findOne({
            $and:[{ 
                $or: [
                    { $and: [{friend_1: user1}, {friend_2: user2}] },
                    { $and: [{friend_1: user2}, {friend_2: user1}] }
                    ]
                }
            , { status: 1 }]
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function isInvited(user1, user2){
    try {
        return await friends.findOne({
            $and:[ 
                {friend_1: user1}, 
                {friend_2: user2}, 
                {status: 0}
            ]});
    } catch (error) {
        console.log(error);
        return error;
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