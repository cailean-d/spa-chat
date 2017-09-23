//nodejs modules
const express = require('express');                               // express framework
const router = express.Router();                                  // app routes
const fs = require('fs');                                         // file system
const app = require('express')();                                 // express application
const httpExpressServer = require('http').Server(app);            // http server
const io = require('socket.io')(httpExpressServer);               // socket server
const bodyParser = require('body-parser')                         // x-www-form-urlencoded


const port = process.env.PORT || '3000';
app.set('port', port);



//middlewares
app.use(bodyParser.json());                                    // post data
app.use(bodyParser.urlencoded({ extended: false }));           // post data
app.use(express.static('client'));                             // static dir


app.get('*', (req, res) => {
    res.sendFile('client/index.html');
});
  

httpExpressServer.listen(port, () => console.log(`API running on localhost:${port}`));
  