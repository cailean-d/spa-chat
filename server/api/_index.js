const express = require('express');
const router = express.Router();

//api import
const users = require('./users');
const upload = require('./upload');
const friends = require('./friends');

// user api
router.get('/users', (req, res) => {users.getUsers(req, res)});
router.get('/users/count', (req, res) => {users.getCount(req, res)})
router.get('/users/me', (req, res) => {users.getMyProfile(req, res)})
router.get('/users/:id', (req, res) => {users.getUser(req, res)});
router.put('/users/', (req, res) => {users.updateUser(req, res)});
router.delete('/users/', (req, res) => {users.deleteUser(req, res)});

//upload api
router.post('/upload/avatar', (req, res) => {upload.uploadAvatar(req, res)});

//friends api
router.get('/friends/friends', (req, res) => {friends.getFriends(req, res)});
router.get('/friends/invites', (req, res) => {friends.getInvites(req, res)});
router.get('/friends/friends/count', (req, res) => {friends.getFriendsCount(req, res)});
router.get('/friends/invites/count', (req, res) => {friends.getInvitesCount(req, res)});
router.post('/friends/invite/:id', (req, res) => {friends.inviteFriend(req, res)});
router.post('/friends/friend/:id', (req, res) => {friends.addFriend(req, res)});
router.delete('/friends/invite/:id', (req, res) => {friends.rejectFriend(req, res)});
router.delete('/friends/friend/:id', (req, res) => {friends.deleteFriend(req, res)});
router.put('/friends/invite/:id', (req, res) => {friends.isInvited(req, res)});
router.put('/friends/friend/:id', (req, res) => {friends.isFriend(req, res)});

module.exports = router;