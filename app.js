const express = require('express');
const app = express();
const http = require('http');
require('dotenv').config();
const expressServer = http.createServer(app);
const {Server, Socket} = require('socket.io');
const io = new Server(expressServer);
const mongoose = require('mongoose');
const {userRouter} = require("./routes/userRoutes");
const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require("path");
const userModel = require("./models/User");


//server configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', async (socket) => {
    console.log('Connected to Server')

    socket.on('authenticate', async (token) => {
        try {
            if (!token) {
                socket.emit('error','Invalid token');
                return socket.emit('authenticate', false);
            }

            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                try {
                    if (err) {
                        socket.emit('error', 'JWT verification failed.');
                        return socket.emit('authenticate', false);
                    }

                    const user = await userModel.findOne({email: decoded.email});

                    if (!user) {
                        socket.emit('error', 'User not found');
                        return socket.emit('authenticate', false);
                    }

                    if (token === user.token) {
                        socket.emit('authenticate', true);
                    } else {
                        socket.emit('error', 'You are account was logged in to another device');
                        socket.emit('authenticate', false);
                    }
                } catch (error) {
                    socket.emit('error', 'Something went wrong. Please log in again.');
                    socket.emit('authenticate', false);
                }
            });
        } catch (error) {
            socket.emit('error', 'Something went wrong. Please log in again.');
            console.error("Authentication error:", error);
            socket.emit('authenticate', false);
        }
    });

    socket.on('disconnect', (code) => {
        console.log(`Client disconnected: ${code}`);
    });
});


// for accessing file under upload directory in browser with file name
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
if (!fs.existsSync(__dirname+'/uploads')) {
    fs.mkdirSync(__dirname+'/uploads');
}


// Router
app.use('/',userRouter)

app.get('/', (req, res) => {
    res.status(403).json({
        success: false,
        message: `This path ${req.originalUrl} isn't on this server!`,
    });
});



mongoose.connect(process.env.MONGO_URI).then(() => {
    expressServer.listen(5000,()=>{
        console.clear();
        console.log("Server started on port 5000");
    });
}).catch((err) => {
    console.error(err);
});


