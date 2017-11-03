const database = require('../database/users');
const bcrypt = require('bcryptjs');       

async function getUsers(req, res){
    try {
        let offset, limit;
        
        offset = req.query.offset ? Number(req.query.offset) : 0;
        limit = req.query.limit ? Number(req.query.limit) : 20;
    
        let users = await database.getUsers(offset, limit);
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }

}

async function getUser(req, res){
    try {
        let user = await database.getUser(req.params.id);

        if(!user){
           return res.status(404).json({ status: 404, message: 'User not found'});
        }

        if(user.deleted){
           return res.status(200).json({ status: 200, message: 'User is deleted', 
           data: {
            id: user.id,
            nickname: user.nickname
           }});
        }

        return res.status(200).json({
            id: user.id,
            nickname: user.nickname,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            gender: user.gender,
            about: user.about,
            birthday: user.birthday,
            phone: user.phone,
            website: user.website,
            country: user.country,
            city: user.city,
            language: user.language,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getMyProfile(req, res){
    try {
        let user = await database.getUser(req.session.userid);

        if(!user){
           return res.status(404).json({ status: 404, message: 'User not found'});
        }

        res.status(200).json({
            id: user.id,
            nickname: user.nickname,
            email: user.email,
            date: user.date,
            rooms: user.rooms,
            language: user.language,
            city: user.city,
            country: user.country,
            website: user.website,
            phone: user.phone,
            birthday: user.birthday,
            about: user.about,
            gender: user.gender,
            status: user.status,
            avatar: user.avatar,
            lastname: user.lastname,
            firstname: user.firstname
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}



async function updateUser(req, res){
    try {
        
        if(req.body.id){
            return res.status(400).json({ status: 400, message: 'You cannot change your id'}); 
        }
        if(req.body.date){
            return res.status(400).json({ status: 400, message: 'You cannot change your registration date'}); 
        }
        if(req.body.email){
            return res.status(400).json({ status: 400, message: 'You cannot change your email'}); 
        }

        if(req.body.password){
            let user = database.getUser(req.session.userid);

            if (!user){
                return res.status(404).json({ status: 404, message: 'User not found'});
            } 

            let comparePassword = await bcrypt.compare(req.body.oldpassword, user.password);

            if(!comparePassword){
                return res.status(400).json({ status: 400, message: `Incorrect password`});
            }

            let bcryptedPassword = await bcrypt.hash(req.body.password, 8);

            delete req.body.oldpassword;
            req.body.password = bcryptedPassword;
            
            await database.updateUser(req.session.userid, req.body);
            return res.status(200).json({ status: 200, message: "success"});

        } else {
            await database.updateUser(req.session.userid, req.body);
            return res.status(200).json({ status: 200, message: "success"});
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function deleteUser(req, res){
    try {
        let user = await database.getUser(req.session.userid);

        if(!user){
            return res.status(404).json({ status: 404, message: `User not found!`});
        }

        await database.deleteUser(req.session.userid);
        req.session.destroy();
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function restoreUser(req, res){
    try {
        let user = await database.getUser(req.session.userid);

        if(!user){
            return res.status(404).json({ status: 404, message: `User not found!`});
        }

        await database.restoreUser(req.session.userid);
        return res.status(200).json({ status: 200, message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}

async function getCount(req, res){
    try {
        return await database.getCount();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: error}); 
    }
}




module.exports.getUser = getUser;              
module.exports.updateUser = updateUser;        
module.exports.deleteUser = deleteUser;        
module.exports.getUsers = getUsers;
module.exports.getCount = getCount;
module.exports.getMyProfile = getMyProfile;
module.exports.restoreUser = restoreUser;
