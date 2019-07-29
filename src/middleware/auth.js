const jwt = require('jsonwebtoken');
const config = require('../config/auth.json');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader)
        return res.status(401).json({ "message":"undefined token 1" });
    
    const parts = authHeader.split(' ');
    if(!parts.length === 2)
        return res.status(401).json({ "message":"invalid token 2" });
    
    const [ scheme, token ] = parts;

    if(!/^Bearer$/i.test(scheme))
        return res.status(401).json({ "message":"invalid token 3" });
    
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return res.status(401).json({ "message":"invalid token 4" });

        req.userId = decoded.id;
        return next();
    });
};