const express = require('express');
const mongoose = require('mongoose');

const {SIGNUP} = require("../controllers/user/Signup");
const {uploadFile} = require("../middlewares/UploadFile");
const {LOGIN} = require("../controllers/user/Login");
const {validateToken} = require("../middlewares/Auth");
const userModel = require("../models/User");

const userRouter = express.Router();


userRouter.post('/signup',uploadFile('image'),SIGNUP)
userRouter.post('/login',uploadFile('none'),LOGIN)
userRouter.get('/post',validateToken, async (req, res)=> {
    try {

        const users = await userModel.find();
        res.send(users);

    }catch (e) {
        console.error(e);
        return res.status(401).send("Internal Server Error");
    }
})

module.exports = {userRouter}