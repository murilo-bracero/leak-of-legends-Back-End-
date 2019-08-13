const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const modelUser = mongoose.model('User');
const jwt = require('jsonwebtoken');
const config = require('../config/auth');

function generateToken(id){
    const token = jwt.sign(
        { id },
        config.secret,
        {expiresIn: 604800});

        return token;
}

module.exports = {
    async login(req, res){
        const { username, password } = req.body;
        try{
            const user = await modelUser.findOne({ 'Username':username }).select('+Password');

            if(!await bcrypt.compare(password, user.Password)){
                return res.status(400).json({ "message":"wrong password" });
            }

            user.Password = undefined;
            return res.status(200).json({user, 'token': generateToken(user.id)});
        }catch(err){
            return res.status(400).json({ "message":"user doesnt exists in our database" });
        }
    },
}