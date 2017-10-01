//nodejs modules
const fs = require('fs');                                         // file system
const path = require('path');                                     // path module      
const express = require('express');                               // express framework
const app = require('express')();                                 // express application
const httpExpressServer = require('http').Server(app);            // http server
const io = require('socket.io')(httpExpressServer);               // socket server
const bodyParser = require('body-parser')                         // x-www-form-urlencoded
const mongoose = require('mongoose');                             // mongodb driver
const session = require('express-session')                        // session for express
const cookieParser = require('cookie-parser')                     // cookie parser
const device = require('express-device');                         // user device type info
const useragent = require('express-useragent');                   // user browser info
const requestIp = require('request-ip');                          // request ip


// configs
const config = JSON.parse(fs.readFileSync('./conf/config.json', 'utf-8'));
const dbConfig = require('./conf/database');
const sessionConfig = require('./conf/session');


//custom modules
const api = require('./server/api/_index.js');
const info = require('./server/middlewares/userinfo');


//middlewares
app.use(bodyParser.json());                                    // post data json
app.use(bodyParser.urlencoded({ extended: false }));           // post data encoded
app.use(device.capture());                                     // user device type info
app.use(useragent.express());                                  // user browser info
app.use(requestIp.mw())                                        // user ip info
app.use(cookieParser(config.session.secret))                   // parse cookie
app.use(session(sessionConfig(session)));                      // app sessions
app.use(express.static('client'));                             // static dir
app.use('/api', api);                                          // include server api


//send index file from all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});
  

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig, {useMongoClient: true}, function(err) {
    if (err) throw err;
    console.log('connected to mongodb!');
});


//start server
httpExpressServer.listen((process.env.PORT || '3000'), () => console.log(`Server running on localhost:${httpExpressServer.address().port}`));
  