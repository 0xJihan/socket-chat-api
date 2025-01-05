const jwt = require("jsonwebtoken");


const validateToken = async (req, res, next) => {
    let token = req.headers.authorization;

    //? checking if token is not null
    if (token) {
        //! validating token
        try {
            token = token.split(" ")[1];
            let user = jwt.verify(token, process.env.SECRET_KEY);

            req.uid = user.uid;
            req.email = user.email;
            next()
        } catch (err) {
            res.status(401).send(
                "Unauthorized user"
            )
        }

    } else {
        res.status(401).send(
           "unauthorized access"
        );
    }

}

module.exports = {validateToken}