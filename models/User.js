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
        required:true,
    },
    isOnline:{
        type:Boolean,
        default:false
    },
    deviceId:{
        type:String,
        default:""
    }
},{timestamps: true});


module.exports = mongoose.model('User',userSchema);