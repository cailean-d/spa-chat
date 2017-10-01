const database = require('../database/users');
const userinfo = require('../middlewares/userinfo');
const bcrypt = require('bcryptjs');                                

function getUsers(req, res){

    let offset, limit;

    offset = req.query.offset ? Number(req.query.offset) : 0;
    limit = req.query.limit ? Number(req.query.limit) : 10;

    database.getUsers(offset, limit, function(err, docs){
        if (err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot get users'}); 
        } else{
            res.status(200).json(docs);
        }
    });
}

function getUser(req, res){
    database.getUser(req.params.id, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot find user'}); 
        } else if (!doc){
            res.status(404).json({ status: 404, message: 'User not found'});
        } 
        else{
            res.status(200).json(doc);
        }
    })     
}

function registerUser(req, res){
    let data = req.body; 
    
    if(!data.firstname){
        res.status(400).json({ status: 400, message: 'Firstname is required'}); 
        return;
    }
    if(!data.lastname){
        res.status(400).json({ status: 400, message: 'Lastname is required'}); 
        return;
    }
    if (!data.email){
        res.status(400).json({ status: 400, message: 'Email is required'}); 
        return;
    }
    if (!data.password){
        res.status(400).json({ status: 400, message: 'Password is required'}); 
        return;
    }


    bcrypt.hash(data.password, 8, function( err, bcryptedPassword) {
        if(err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot create user!'}); 
        } else {
            database.registerUser(data.firstname, data.lastname, data.email, bcryptedPassword, 
                function(err, doc, affected){
                    if(err){
                        console.log(err);
                        res.status(400).json({ status: 400, message: 'Email already exists!'}); 
                    } else {
                        res.status(200).json({ status: 200, message: `User [${doc.id}] created!`});
                    }
                }) 
        }
    });

}

function updateUser(req, res){
    let data = req.body; 
    
    if(!data.firstname){
        res.status(400).json({ status: 400, message: 'Firstname is required'}); 
        return;
    }
    if(!data.lastname){
        res.status(400).json({ status: 400, message: 'Lastname is required'}); 
        return;
    }
    if (!data.email){
        res.status(400).json({ status: 400, message: 'Email is required'}); 
        return;
    }
    if (!data.password){
        res.status(400).json({ status: 400, message: 'Password is required'}); 
        return;
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
            res.status(500).json({ status: 500, message: 'Cannot update user!'}); 
        } 
        else if(!doc){
            res.status(404).json({ status: 404, message: `User not found!`});
        } 
        else{
            res.status(200).json({ status: 200, message: `User [${doc.id}] updated!`});
        }
    })   
}

function deleteUser(req, res){
    database.deleteUser(req.params.id, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot delete user!'}); 
        } else if(!doc){
            res.status(404).json({ status: 404, message: `User not found!`});
        } else{
            res.status(200).json({ status: 200, message: `User [${doc.id}] deleted!`});
        }
    }) 
}

function getCount(req, res){
    database.getCount(function(err, count){
        if(err){
            res.status(500).json({ status: 404, message: 'Cannot count user!'}); 
        } else {
            res.status(200).json(count);
        }
    });
}


function loginUser(req, res){
    let data = req.body; 

    if(!data.email){
        res.status(400).json({ status: 400, message: 'Email is required'}); 
        return;
    }
    if(!data.password){
        res.status(400).json({ status: 400, message: 'Password is required'}); 
        return;
    }

    database.getUserByEmail(data.email, function(err, doc){
        if (err){
            console.log(err);
            res.status(500).json({ status: 500, message: 'Cannot log in!'}); 
        } else if(!doc){
            res.status(400).json({ status: 400, message: `No such email!`});
        } else{
            bcrypt.compare(data.password, doc.password, function(err, doesMatch){
                if (err){
                    console.log(err);
                    res.status(500).json({ status: 500, message: 'Cannot log in!'}); 
                } else if(!doesMatch){
                    res.status(400).json({ status: 400, message: `Incorrect password`});
                } else {
                    req.session.logined = true;
                    userinfo(req);
                    res.status(200).json({ status: 200, message: `User [${doc.id}] logined!!!`});
                }
              });
        }
    })
}

function logoutUser(req, res){
    req.session.destroy();
    res.status(200).json({ status: 200, message: `User logouted!`});
}

module.exports.registerUser = registerUser;    // C
module.exports.getUser = getUser;              // R
module.exports.updateUser = updateUser;        // U 
module.exports.deleteUser = deleteUser;        // D
module.exports.getUsers = getUsers;
module.exports.getCount = getCount;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;