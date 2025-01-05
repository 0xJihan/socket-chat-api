const multer = require("multer");

// Middleware for uploading files
const uploadFile = (label) => {
    const storage = multer.memoryStorage(); //! Store file in memory
    const upload = multer({ storage: storage }).single(label); //! Create upload middleware

    return (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).send({ error: err.message }); //! Handle multer-specific errors
            } else if (err) {
                return res.status(400).send({ error: err.message }); //! Handle generic errors
            }
            next(); //! Proceed to the next middleware
        });
    };
};

module.exports = {uploadFile};