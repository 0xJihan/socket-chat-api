const express = require('express');
const {validateToken} = require("../middlewares/Auth");
const userController = require("../controllers/userControllers");
const {upload} = require("../middlewares/Upload");

const userRouter = express.Router();


userRouter.post('/login',userController.loginController)
userRouter.post('/signup',userController.signupController)
userRouter.post('/upload',validateToken,upload.single('profileImage'),userController.uploadProfile)




module.exports = {userRouter}