const jwt = require('jsonwebtoken')
const userModel = require('../models/User');


const authenticationHandler = function (socket, context){
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

                    const user = await userModel.findById(decoded.id)

                    if (!user) {
                        socket.emit('error', 'User not found');
                        return socket.emit('authenticate', false);
                    }

                    if (token === user.token) {
                        context.documentId = decoded.id;
                        socket.emit('authenticate', true);
                        user.isOnline = true;
                        await user.save();
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
};

module.exports = {authenticationHandler};