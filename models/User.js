const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
        default:null,
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    deviceId:{
        type:String,
        default:""
    },
    token:{
        type:String,
        required:true,
    }
},{timestamps: true});


module.exports = mongoose.model('User',userSchema);