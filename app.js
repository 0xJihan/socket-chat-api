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
const path = require("path");
const userModel = require("./models/User");
const {authenticationHandler} = require("./socket/Authentication");


//server configs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on('connection', async (socket) => {

    const context = {
        documentId:null
    }


    console.log('Connected to Server')

    // Handling token authentication
  authenticationHandler(socket,context);





    socket.on('disconnect', async (code) => {
        console.log(`Client disconnected: ${code}`);
       try{
           await userModel.findByIdAndUpdate(context.documentId,{
               isOnline: false
           });
       }catch(err){
           console.log("\n\n\n\n")
           console.clear()
           console.log(err);
       }
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


