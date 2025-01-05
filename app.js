const express = require('express');
const app = express();
const http = require('http');
require('dotenv').config();
const expressServer = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server();
const mongoose = require('mongoose');
const {userRouter} = require("./routes/userRoutes");


io.on('connection', (socket) => {

    console.log('Connected to Server')

    socket.on('disconnect', (code) => {
        console.log(`Client disconnected: ${code}`);
    })
})


app.use('/',userRouter)

app.get('/', (req, res) => {
    res.send('Hello World!');
})


mongoose.connect(process.env.MONGO_URI).then(() => {
    expressServer.listen(5000,()=>{
        console.log("Server started on port 5000")
    });
}).catch((err) => {
    console.error(err);
})


