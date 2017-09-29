//nodejs modules
const express = require('express');                               // express framework
const path = require('path');                                     // path module      
const app = require('express')();                                 // express application
const httpExpressServer = require('http').Server(app);            // http server
const io = require('socket.io')(httpExpressServer);               // socket server
const bodyParser = require('body-parser')                         // x-www-form-urlencoded
const mongoose = require('mongoose');                             // mongodb driver
const dbconfig = require('./server/database/read-config');

//custom modules
const api = require('./server/api/_index.js');


// server config
const port = process.env.PORT || '3000';
app.set('port', port);


//middlewares
app.use(bodyParser.json());                                    // post data json
app.use(bodyParser.urlencoded({ extended: false }));           // post data encoded
app.use(express.static('client'));                             // static dir
app.use('/api', api);                                          // include server api


//send index file from all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});
  

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect(dbconfig, {useMongoClient: true}, function(err) {
    if (err) throw err;
    console.log('connected to mongodb!');
});


//start server
httpExpressServer.listen(port, () => console.log(`Server running on localhost:${port}`));
  