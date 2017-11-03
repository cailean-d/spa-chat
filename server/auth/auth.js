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


function loginUser(req, res){
    let data = req.body; 

    if(!data.email){
        return res.status(400).json({ status: 400, message: 'Email is required'}); 
    }
    if(!data.password){
        return res.status(400).json({ status: 400, message: 'Password is required'}); 
    }

    database.getUserByEmail(data.email, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot log in!'}); 
        } else if(!doc){
            res.status(400).json({ status: 400, message: `The email does not exists!`});
        } else{
            bcrypt.compare(data.password, doc.password, function(err, doesMatch){
                if (err){
                    console.log(err);
                    res.status(500).json({ status: 500, message: 'Cannot log in!'}); 
                } else if(!doesMatch){
                    res.status(400).json({ status: 400, message: `Incorrect password`});
                } else {
                    if(config.auth.type == 'session'){
                        database.updateUser(doc.id, {status: 'online'}, (err, doc) => {
                            if(err) console.log(err.message);
                        })
                        createSession(req, res, doc);
                    } else if (config.auth.type == 'jwt'){
                        createJWT(req, res, doc);
                    }
                }
              });
        }
    })
}


function registerUser(req, res){
    let data = req.body; 
    
    if(!data.nickname){
        return res.status(400).json({ status: 400, message: 'Nickname is required'}); 
    }
    if (!data.email){
        return res.status(400).json({ status: 400, message: 'Email is required'}); 
    }
    if (!data.password){
        return  res.status(400).json({ status: 400, message: 'Password is required'}); 
    }


    bcrypt.hash(data.password, 8, function( err, bcryptedPassword) {
        if(err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot create user!'}); 
        } else {
            database.registerUser(data.nickname, data.email, bcryptedPassword, 
                function(err, doc, affected){
                    if(err){
                        console.log(err);
                        if(err.code === 11000){
                            res.status(400).json({ status: 400, message: "Email or Nickname already exists"}); 
                        } else {
                            res.status(400).json({ status: 400, message: err.message});
                        }
                    } else {
                        if(config.auth.type == 'session'){
                            database.updateUser(doc.id, {status: 'online'}, (err, doc) => {
                                if(err) console.log(err.message);
                            })
                            createSession(req, res, doc);
                        } else if (config.auth.type == 'jwt'){
                            createJWT(req, res, doc);
                        }
                    }
                }) 
        }
    });

}

function logoutUser(req, res){
    database.updateUser(req.session.userid, {status: 'offline'}, (err, doc) => {
        if(err) console.log(err.message);
    })
    req.session.destroy();
    res.status(200).json({ status: 200, message: `User logouted!`});
}


function checkAuth(req, res){
    if(config.auth.type == 'session'){
        if(req.session.logined){
            res.status(200).json({ status: 200, message: true});
        } else {
            res.status(401).json({ status: 401, message: false});
        }
    } else if (config.auth.type == 'jwt'){
        if(req.headers && req.headers.authorization){
            jwt.verify(req.headers.authorization, config.auth.jwt.secret, function(err, decoded) {
               if (err){
                   console.log(err);
                   res.status(401).json({ status: 401, message: false});
               } else {
                   res.status(200).json({ status: 200, message: true});
               }
              }); 
        } else{
            res.status(200).json({ status: 200, message: false});
        }
    }
}



function createSession(req, res, doc){
    req.session.logined = true;
    req.session.userid = doc.id;
    req.session.firstname = doc.firstname;
    req.session.lastname = doc.lastname;
    req.session.userinfo = userinfo(req);
    res.status(200).json({ status: 200, type: 'session', message: `User [${doc.id}] logined!!!`});
}

function createJWT(req, res, doc){
    jwt.sign({
         logined : true,
         userid : doc.id,
         firstname : doc.firstname,
         lastname : doc.lastname,
         userinfo : userinfo(req)
        }, config.auth.jwt.secret, 
        { algorithm: config.auth.jwt.algorithm,
          expiresIn: config.auth.jwt.maxAge + 'd'
        }, function(err, token) {
            if(err){
                console.log(err);
            } else {
                res.status(200).json({ status: 200, type: 'jwt', message: token});
            }
      });
}
