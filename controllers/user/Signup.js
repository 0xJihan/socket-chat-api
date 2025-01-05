const bcrypt=require('bcrypt')
const userModel = require('../../models/User')
const {writeFile} = require("../../middlewares/WriteFile");


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

        writeFile('/profile/immage',req.file.buffer)(req,res);

        const result = await userModel.create({
            name:name,
            email : email,
            password:hashedPassword,
            imageUrl:req.file.filePath,
        });

        return res.status(200).send(result)


    }catch(err){
        console.log(err);
    }
}



module.exports = {SIGNUP}