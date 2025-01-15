const jwt = require('jsonwebtoken');


const fun = function (token) {

    try {

    const mToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!mToken) {
        return null
    }else{
        return mToken;
    }

    }catch(err){
        return null
    }
}

module.exports = {'extractToken': fun};