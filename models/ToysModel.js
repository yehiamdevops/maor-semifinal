const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const toysModel = new mongoose.Schema({
    name: String,
    info: String,
    category: String,
    img_url: String,
    price: Number,
    dateCreated: { type: Date, default: Date.now },
    user_id: String
    

},{timestamps: true});
exports.ToysModel = mongoose.model("toys",toysModel);
exports.ToyValidation = (requestBody)=> {
    let joiSchema =  Joi.object({
       name: Joi.string().required().max(80),
       info: Joi.string().required().max(80),
       category: Joi.string().required().max(20),
       img_url: Joi.string().uri().max(200).required(),
       price:Joi.number().max(20000).required(),
       user_id: Joi.required() 
    });
    return joiSchema.validate(requestBody);

}
