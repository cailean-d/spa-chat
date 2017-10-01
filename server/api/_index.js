const express = require('express');
const router = express.Router();

//api import
const users = require('./users');

// user api
router.get('/users', (req, res) => {users.getUsers(req, res)});
router.get('/users/count', (req, res) => {users.getCount(req, res)})
router.get('/users/:id', (req, res) => {users.getUser(req, res)});
router.post('/users', (req, res) => {users.registerUser(req, res)});
router.post('/users/login', (req, res) => {users.loginUser(req, res)})
router.post('/users/logout', (req, res) => {users.logoutUser(req, res)})
router.put('/users/:id', (req, res) => {users.updateUser(req, res)});
router.delete('/users/:id', (req, res) => {users.deleteUser(req, res)});


module.exports = router;