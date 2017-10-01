const fs = require('fs'); 
const path = require('path');     
const mongoose = require('mongoose');                            
const MongoStore = require('connect-mongo');            
const config = JSON.parse(fs.readFileSync(path.join(__dirname, './config.json'), 'utf-8'));

module.exports = function(session){

  let Store = MongoStore(session);

  let sessionStore = new Store({ 
        mongooseConnection: mongoose.connection,
        ttl: Number(config.auth.session.maxAgeServer) * 86400
  })

  let conf = {
        store: sessionStore,
        secret: config.auth.session.secret,
        resave: (config.auth.session.resave === "true"),
        saveUninitialized: (config.auth.session.saveUninitialized === "true"),
        cookie: {
            maxAge: Number(config.auth.session.maxAgeClient) * 86400000,
            secure: (config.auth.session.secure === "true")
        }
  }

  return conf;
}



