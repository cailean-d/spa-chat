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
 
 
function inviteFriend(sender, receiver, callback){

    friend = new friends({
        friend_1: sender,
        friend_2: receiver,
   });
 
   friend.save(function(err, doc, affected){
       callback(err, doc, affected);
   });
}

function addFriend(sender, receiver, callback){
    friends.findOneAndUpdate({$and:[ {friend_1: sender}, {friend_2: receiver}]}, {status: 1}, { new: true }, function(err, doc){
        callback(err, doc);
    })
}
 
function deleteFriend(sender, receiver, callback){
    friends.findOneAndRemove({
        $or: [
            { $and: [{friend_1: sender}, {friend_2: receiver}] },
            { $and: [{friend_1: receiver}, {friend_2: sender}] }
        ]
    },  function (err, doc){
        callback(err, doc);
    });
}

function rejectFriend(sender, receiver, callback){
    friends.findOneAndRemove({$and:[ {friend_1: sender}, {friend_2: receiver}, {status: 0}]},  function (err, doc){
        callback(err, doc);
    });
}

function getFriends(id, callback){
    friends.find({
        $and: [
            { $or: [{friend_1: id}, {friend_2: id}] },
            { status: 1 }
        ]
    }, function (err, results) {
        callback(err, results);
    })
}

function getInvites(id, callback){
    friends.find({ $and: [ { friend_2: id }, { status: 0 }] }, function (err, results) {
        callback(err, results);
    })
}

function getInvitesCount(id, callback){
    friends.count({ $and: [ { friend_2: id }, { status: 0 }] }, function (err, count) {
        callback(err, count);
    });
}

function getFriendsCount(id, callback){
    friends.count({
        $and: [
            { $or: [{friend_1: id}, {friend_2: id}] },
            { status: 1 }
        ]
    }, function (err, count) {
        callback(err, count);
    });
}

 module.exports.inviteFriend = inviteFriend;    
 module.exports.addFriend = addFriend;              
 module.exports.deleteFriend = deleteFriend;        
 module.exports.rejectFriend = rejectFriend;        
 module.exports.getFriends = getFriends;
 module.exports.getInvites = getInvites;
 module.exports.getFriendsCount = getFriendsCount;
 module.exports.getInvitesCount = getInvitesCount;