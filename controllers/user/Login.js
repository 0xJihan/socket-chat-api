const bcrypt = require('bcrypt');
const userModel = require('../../models/User')
const jwt = require('jsonwebtoken');

const LOGIN = async (req,res)=>{


    const {email, password} = req.body;


    if (!email || !password){
        return res.status(400).send('Data missing');
    }

    try{

        const userExist = await userModel.findOne({email : email});
        if(!userExist){
            return res.status(400).send('Incorrect email');
        }

        const isPasswordSame = await bcrypt.compare(password, userExist.password);

        if(!isPasswordSame){
            return res.status(400).send('Incorrect password');
        }

        userExist.token = await jwt.sign({email: email}, process.env.SECRET_KEY);
        await userExist.save();
        return res.status(201).send(userExist);


    }catch(err){
        console.log(err);
        return res.status(400).send('Something went wrong');
    }

}

module.exports = {LOGIN};