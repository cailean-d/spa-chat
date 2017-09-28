const database = require('../database/users');

function getAllUsers(req, res){
    res.send('get all users');    
}

function getUser(req, res){
    database.getUser(req.params.id, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).send('Cannot find user!'); 
        } else if (!doc){
            res.status(404).send(`User not found!`);
        } 
        else{
            res.status(200).json(doc);
        }
    })     
}

function registerUser(req, res){
    let data = req.body; 
    
    if(!data.firstname){
        res.status(400).send('Firstname is required!'); 
        return;
    }
    if(!data.lastname){
        res.status(400).send('Lastname is required!'); 
        return;
    }
    if (!data.email){
        res.status(400).send('Email is required!'); 
        return;
    }
    if (!data.password){
        res.status(400).send('Password is required!'); 
        return;
    }
    database.registerUser(data.firstname, data.lastname, data.email, data.password, 
    function(err, doc, affected){
        if(err){
            console.log(err);
            res.status(500).send('Cannot create user!'); 
        } else {
            res.status(200).send(`User [${doc.id}] created!`);
        }
    })  
}

function updateUser(req, res){
    let data = req.body; 
    
    if(!data.firstname){
        res.status(400).send('Firstname is required!'); 
    }
    if(!data.lastname){
        res.status(400).send('Lastname is required!'); 
    }
    if (!data.email){
        res.status(400).send('Email is required!'); 
    }
    if (!data.password){
        res.status(400).send('Password is required!'); 
    }

    let body = {
        firstname : data.firstname,
        lastname : data.lastname,
        email : data.email,
        password : data.password
    }

    database.updateUser(req.params.id, body, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).send('Cannot update user!'); 
        } 
        else if(!doc){
            res.status(404).send(`User not found!`);
        } 
        else{
            res.status(200).send(`User [${doc.id}] updated!`);
        }
    })   
}

function deleteUser(req, res){
    database.deleteUser(req.params.id, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).send('Cannot delete user!'); 
        } else if(!doc){
            res.status(404).send(`User not found!`);
        } else{
            res.status(200).send(`User [${doc.id}] deleted!`);
        }
    }) 
}


module.exports.registerUser = registerUser;    // C
module.exports.getUser = getUser;              // R
module.exports.updateUser = updateUser;        // U 
module.exports.deleteUser = deleteUser;        // D
module.exports.getAllUsers = getAllUsers;