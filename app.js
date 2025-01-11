const express = require('express');
const app = express();
const http = require('http');
require('dotenv').config();
const expressServer = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(expressServer);
const mongoose = require('mongoose');
const {userRouter} = require("./routes/userRoutes");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');




io.on('connection', async (socket) => {

    const token = socket.handshake.auth.token;
    let email;
    if (!token) {
        console.log("No token provided");
        socket.disconnect();
    }

   await jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            socket.disconnect();
            console.log(err)
        }else{
           email = decoded.email;
        }
    });


    console.log('Connected to Server')








    socket.on('disconnect', (code) => {
        console.log(`Client disconnected: ${code}`);
    })
})

// Router
app.use('/',userRouter)

app.get('/', (req, res) => {
    res.status(403).json({
        success: false,
        message: `This path ${req.originalUrl} isn't on this server!`,
    });
});


// middlewares
//app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI).then(() => {
    expressServer.listen(5000,()=>{
        console.log("Server started on port 5000")
    });
}).catch((err) => {
    console.error(err);
});


