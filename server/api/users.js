const database = require('../database/users');
                         

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



function updateUser(req, res){
    let data = req.body; 
    
    if(!data.firstname){
       return res.status(400).json({ status: 400, message: 'Firstname is required'}); 
    }
    if(!data.lastname){
        return res.status(400).json({ status: 400, message: 'Lastname is required'}); 
    }
    if (!data.email){
        return res.status(400).json({ status: 400, message: 'Email is required'}); 
    }
    if (!data.password){
        return res.status(400).json({ status: 400, message: 'Password is required'}); 
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
    database.getUser(req.params.id, function(err, doc){
        if (err) {
            console.log(err);
           return res.status(500).json({ status: 500, message: 'Cannot delete user!'}); 
        } else if(!doc){
           return res.status(404).json({ status: 404, message: `User not found!`});
        } else if (req.params.id != req.session.userid){
           return res.status(400).json({ status: 400, message: 'You cannot delete another user'}); 
        } else {
            database.deleteUser(req.params.id, function(err, doc){
                if (err){
                    console.log(err);
                    res.status(500).json({ status: 500, message: 'Cannot delete user!'}); 
                } else if(!doc){
                    res.status(404).json({ status: 404, message: `User not found!`});
                } else{
                    req.session.destroy();
                    res.status(200).json({ status: 200, message: `User [${doc.id}] deleted!`});
                }
            }) 
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




module.exports.getUser = getUser;              
module.exports.updateUser = updateUser;        
module.exports.deleteUser = deleteUser;        
module.exports.getUsers = getUsers;
module.exports.getCount = getCount;
