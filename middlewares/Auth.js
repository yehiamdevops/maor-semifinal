const jwt = require('jsonwebtoken');
const { TOKEN_STRING } = require('../secret/configlist.js');

const auth = async(req,res,next) =>{
    const token = req.header('x-api-key');
    if(!token){
        return res.status(401).json({token: "", err:"you need to send token to the end point"});
    }
    try {
        const decoded = jwt.verify(token, TOKEN_STRING);
        // console.log(decoded);
        req.tokenData = decoded;
        next();        
        
        
        
    } catch (error) {
        
        return res.status(403).json({err: "your token is expired!!!!"});
    }
    
    
};
module.exports = auth;