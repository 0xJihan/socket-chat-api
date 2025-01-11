const bcrypt = require('bcrypt');
const userModel = require('../../models/User')
const jwt = require('jsonwebtoken');
const mongoose=require('mongoose');
const LOGIN = async (req,res)=>{


    const {email, password} = req.body;


    if (!email || !password){
        return res.status(400).json({
            message : "Data missing",
            success: false
        });
    }

    try{

        const userExist = await userModel.findOne({email : email});
        if(!userExist){
            return res.status(400).json({
                message:"Incorrect email address",
                success: false
            })
        }

        const isPasswordSame = await bcrypt.compare(password, userExist.password);

        if(!isPasswordSame){
            return res.status(400).json({
                message: 'Invalid password',
                success: false
            })
        }

        userExist.token = await jwt.sign({email: email}, process.env.SECRET_KEY);
        await userExist.save();
        return res.status(201).send(userExist);


    }catch(err){
        console.log(err);
        return res.status(400).json({
            message: "Something went wrong",
            success: false
        });
    }

}

const GETALL_USERS = async (req,res)=> {



}

module.exports = {LOGIN};