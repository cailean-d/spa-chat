//nodejs modules
const express = require('express');                               // express framework
const path = require('path');                                     
const fs = require('fs');                                         // file system
const app = require('express')();                                 // express application
const httpExpressServer = require('http').Server(app);            // http server
const io = require('socket.io')(httpExpressServer);               // socket server
const bodyParser = require('body-parser')                         // x-www-form-urlencoded


const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));  // config file



const port = process.env.PORT || '3000';
app.set('port', port);



//middlewares
app.use(bodyParser.json());                                    // post data
app.use(bodyParser.urlencoded({ extended: false }));           // post data
app.use(express.static('client'));                             // static dir


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/index.html'));
});
  

httpExpressServer.listen(port, () => console.log(`Server running on localhost:${port}`));
  