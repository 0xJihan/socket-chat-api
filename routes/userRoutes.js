const express = require('express');

const {SIGNUP} = require("../controllers/user/Signup");
const {uploadFile} = require("../middlewares/UploadFile");
const {LOGIN} = require("../controllers/user/Login");
const {validateToken} = require("../middlewares/Auth");

const userRouter = express.Router();


userRouter.post('/signup',uploadFile('image'),SIGNUP)
userRouter.post('/login',uploadFile('none'),LOGIN)

module.exports = {userRouter}