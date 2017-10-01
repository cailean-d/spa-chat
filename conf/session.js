const fs = require('fs'); 
const path = require('path');     
const mongoose = require('mongoose');                            
const MongoStore = require('connect-mongo');            
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf-8'));

module.exports = function(session){

  let Store = MongoStore(session);

  let sessionStore = new Store({ 
        mongooseConnection: mongoose.connection,
        ttl: Number(config.session.maxAgeServer) * 86400
  })

  let conf = {
        store: sessionStore,
        secret: config.session.secret,
        resave: (config.session.resave === "true"),
        saveUninitialized: (config.session.saveUninitialized === "true"),
        cookie: {
            maxAge: Number(config.session.maxAgeClient) * 86400000,
            secure: (config.session.secure === "true")
        }
  }

  return conf;
}



