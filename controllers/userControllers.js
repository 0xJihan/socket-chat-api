const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleFileUpload = (req) => {
    if (req.file) {
        const protocol = req.protocol; // 'http' or 'https'
        const host = req.get("host"); // 'localhost:5000' or your production server's domain
        return `${protocol}://${host}/uploads/${req.file.filename}`;
    }
    return null;
};

const signupController = async function (req,res) {
    try{
    const {name, email, password} = req.body;

    if (!name || !email || !password || !name.trim()) {
        return res.status(400).json({
            message : "Missing required field",
            success: false
        })
    }



        // return res.status(201).send('Successfully registered');
        const userExist = await userModel.findOne({ email : email });

        if (userExist){
            return res.status(400).send({
                message:"User already exist.Please Login",
                success:false,
            })
        }

        const hashedPassword = await bcrypt.hash(password, 12);


        const user = new userModel({
            name:name,
            email : email,
            password:hashedPassword,
        });

        const token = await jwt.sign({email:email,id:user._id},process.env.SECRET_KEY)
        user.token = token;
        await user.save();

        return res.status(200).send({
            message:"Registered successfully",
            success:true,
            token:token
        })


    }catch(err){
        console.log(err);

        return res.status(500).send({
            message:"Something went wrong",
            success:false
        })
    }
}


const loginController = async (req,res)=>{
    try{
    const {email, password} = req.body;

    if (!email || !password){
        return res.status(400).json({
            message : "Data missing",
            success: false
        });
    }


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

        const newToken = await jwt.sign({email: email,id:userExist._id}, process.env.SECRET_KEY);
        userExist.token = newToken;

        await userExist.save();


        return res.status(201).send({
            message:"Successfully logged in",
            success:true,
            token: newToken
        });


    }catch(err){
        console.log(err);
        return res.status(400).json({
            message: "Something went wrong...\nPlease try again later",
            success: false
        });
    }

}

const uploadProfile = async (req,res)=>{
    try{
        const email = req.email
        const imageURL = handleFileUpload(req)
        if (!imageURL) {
            return res.status(400).json({
                message: "Image upload failed",
                success: false
            });
        }
            const updatedUser = await userModel.findOneAndUpdate({
                email : email,
            },{imageUrl:imageURL},
                {
                    new : true,
                    runValidators: true
                }).select("-password")

        if (!updatedUser){
            return res.status(404).send({
                message:"User does not exist",
                success:false
            })
        }

        return res.status(200).json(updatedUser);






    }catch (e) {
        console.clear()
        console.log(e)
        return res.status(400).json({
            message:"An error occurred while uploading image",
            success:false
        })
    }
}




module.exports = {
    loginController,
    signupController,
    uploadProfile,
}