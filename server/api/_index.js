const express = require('express');
const router = express.Router();

//api import
const users = require('./users');

// user api
router.get('/users', (req, res) => {users.getUsers(req, res)});
router.get('/users/count', (req, res) => {users.getCount(req, res)})
router.get('/users/me', (req, res) => {users.getMyProfile(req, res)})
router.get('/users/:id', (req, res) => {users.getUser(req, res)});
router.put('/users/:id', (req, res) => {users.updateUser(req, res)});
router.delete('/users/:id', (req, res) => {users.deleteUser(req, res)});


module.exports = router;