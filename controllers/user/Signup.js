const bcrypt=require('bcrypt')
const userModel = require('../../models/User')
const {writeFile} = require("../../middlewares/WriteFile");
const jwt = require('jsonwebtoken');


const SIGNUP = async function (req,res) {

    // checking for valid file
    if (!req.file) {
        return res.status(400).send('Image is required');
    }

    const {name, email, password} = req.body;

    try{

       // return res.status(201).send('Successfully registered');
        const userExist = await userModel.findOne({ email : email });

        if (userExist){
            return res.status(400).send({
                message:"Email already exists",
                success:false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await writeFile('/profile/image',req.file.buffer)(req,res);

        const token = jwt.sign({email:email},process.env.SECRET_KEY)

        const result = await userModel.create({
            name:name,
            email : email,
            password:hashedPassword,
            imageUrl:req.filePath,
            token:token
        });

        return res.status(200).send(result)


    }catch(err){
        console.log(err);
    }
}



module.exports = {SIGNUP}