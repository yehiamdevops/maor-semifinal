const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { TOKEN_STRING } = require('../secret/configlist');

let userModel = new mongoose.Schema({
    name:String,
    email:String,//unique
    password:String,
    role:String
},{timestamps:true});
exports.UserModel = mongoose.model('users', userModel);
exports.CreateToken = (id, role) =>{
    
    return jwt.sign({ _id: id ,_role: role}, TOKEN_STRING, {expiresIn:'60m'});

};
exports.LoginValidation = (requestBody)=>{
    let joiSchema = Joi.object({
        email:Joi.string().required().max(100),
        password: Joi.string().required().max(100)
    })
    return joiSchema.validate(requestBody);

};
exports.UserValidation = (requestBody)=>{
    let joiSchema = Joi.object({
        name:Joi.string().required().max(50),
        email:Joi.string().required().max(100),
        password: Joi.string().required().max(100),
        role:Joi.string().required().max(50)


    });
    return joiSchema.validate(requestBody);

};
