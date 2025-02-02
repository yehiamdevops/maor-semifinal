const router = require('express').Router();
const bcrypt = require('bcrypt');
const {UserValidation, UserModel, LoginValidation, CreateToken} = require('../models/UserModel.js');
router.post('/', async (req, res) => {
    let { error } =  UserValidation(req.body);
    if (error) {
        return res.status(401).json({err: error.details[0].message}); 
        
    }

    let user = req.body;
    if (user.password){
        try {
            const hashedPassword = await bcrypt.hash(user.password, 12);
            user.password = hashedPassword;
            let database = new UserModel(user);
            await database.save();
            user.password = '*****';
            return res.status(201).json(user);
        } catch (error) {
            if(error.code === 11000){
                return res.status(401).send("Duplicate key error: The email already exists.")
            } 
            return res.sendStatus(500);
            
        }
        
    }
    
    
});
router.post('/login', async (req, res) => {
    const {error} = LoginValidation(req.body);
    if (error) {
        return res.status(401).json({err: error.details[0].message});
        
    }
    try {
        
        let user = await UserModel.findOne({email: req.body.email});
        if (!user){
            return res.status(401).json({token:"",err:"email or pass incorrect code 1"});
        }
        const isMatch = bcrypt.compare(req.body.password, user.password);
        // console.log(isMatch);
        
        if(!isMatch){
            return res.status(401).json({token:"",err:"email or pass incorrect code 2"});
        }
        let tokenid = CreateToken(user._id, user.role);
        // console.log(tokenid);
        
        return res.status(201).json({token: tokenid, err:""});
    
    } catch (error) {
        return res.sendStatus(500);
    }

    
});
module.exports = router;
