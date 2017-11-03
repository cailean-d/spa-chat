const express = require('express');
const router = express.Router();
const database = require('../database/users');
const userinfo = require('../middlewares/userinfo');
const bcrypt = require('bcryptjs');       
const jwt = require('jsonwebtoken');
const fs = require('fs');     
const path = require('path');
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../conf/config.json'), 'utf-8'));

router.post('/reg', (req, res) => {registerUser(req, res)})
router.post('/login', (req, res) => {loginUser(req, res)})
router.post('/logout', (req, res) => {logoutUser(req, res)})
router.post('/check', (req, res) => {checkAuth(req, res)})

module.exports = router;

//=============================================================================
//=============================================================================

async function loginUser(req, res){
    try {
        if(!req.body.email){
            return res.status(400).json({ status: 400, message: 'Email is required'}); 
        }
        if(!req.body.password){
            return res.status(400).json({ status: 400, message: 'Password is required'}); 
        }

        let user = await database.getUserByEmail(req.body.email);

        if(!user){
            return res.status(400).json({ status: 400, message: `The email does not exists!`});
        }

        let comparePassword = await bcrypt.compare(req.body.password, user.password);

        if(!comparePassword){
            return res.status(400).json({ status: 400, message: `Incorrect password`});
        }

        if(config.auth.type == 'session'){
            await database.updateUser(doc.id, {status: 'online'})
            createSession(req, res, doc);
        } else if (config.auth.type == 'jwt'){
            createJWT(req, res, doc);
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function registerUser(req, res){

    try {
        if(!req.body.nickname){
            return res.status(400).json({ status: 400, message: 'Nickname is required'}); 
        }
        if (!req.body.email){
            return res.status(400).json({ status: 400, message: 'Email is required'}); 
        }
        if (!req.body.password){
            return  res.status(400).json({ status: 400, message: 'Password is required'}); 
        }

        let bcryptedPassword = await bcrypt.hash(req.body.password, 8);
        let newUser = database.registerUser(req.body.nickname, req.body.email, bcryptedPassword);

        await database.updateUser(doc.id, {status: 'online'});
        
        if(config.auth.type == 'session'){
            createSession(req, res, doc);
        } else if (config.auth.type == 'jwt'){
            createJWT(req, res, doc);
        }

    } catch (error) {
        console.log(error);
        if(error.code === 11000){
            res.status(400).json({ status: 400, message: "Email or Nickname already exists"}); 
        } else {
            res.status(400).json({ status: 400, message: err.message});
        }
    }
}

async function logoutUser(req, res){
    try {
        await database.updateUser(req.session.userid, {status: 'offline'});
        req.session.destroy();
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function checkAuth(req, res){
    try {
        if(config.auth.type == 'session'){
            if(req.session.logined){
                return res.status(200).json({ status: 200, message: true});
            } else {
                return res.status(401).json({ status: 401, message: false});
            }
        } else if (config.auth.type == 'jwt'){
            if(req.headers && req.headers.authorization){
                let verify = await jwt.verify(req.headers.authorization, config.auth.jwt.secret);

                if(verify){
                    return res.status(200).json({ status: 200, message: true});
                } else {
                    return res.status(401).json({ status: 401, message: false});
                }

            } else{
                res.status(401).json({ status: 401, message: false});
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

function createSession(req, res, doc){
    req.session.logined = true;
    req.session.userid = doc.id;
    req.session.firstname = doc.firstname;
    req.session.lastname = doc.lastname;
    req.session.userinfo = userinfo(req);
    return res.status(200).json({ status: 200, type: 'session', message: "success"});
}

async function createJWT(req, res, doc){
    try {
        let signToken = await jwt.sign({
            logined : true,
            userid : doc.id,
            firstname : doc.firstname,
            lastname : doc.lastname,
            userinfo : userinfo(req)
           }, config.auth.jwt.secret, 
           { algorithm: config.auth.jwt.algorithm,
             expiresIn: config.auth.jwt.maxAge + 'd'
           });
        return res.status(200).json({ status: 200, type: 'jwt', message: token});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}
