const express = require('express');

const {SIGNUP} = require("../controllers/user/Signup");
const {uploadFile} = require("../middlewares/UploadFile");

const userRouter = express.Router();


userRouter.post('/signup',uploadFile('image'),SIGNUP)
userRouter.post('/login', (req, res) => {})

module.exports = {userRouter}