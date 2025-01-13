
const multer = require("multer");
const path = require("path");

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Store in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Generate a unique filename
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type! Only JPEG, PNG & JPG are allowed.'));
        }
        cb(null, true);
    }
});

module.exports = {upload};