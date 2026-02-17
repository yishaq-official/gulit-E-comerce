const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// 1. Storage Configuration
const storage = multer.diskStorage({
    destination(req, file, cb) {
        // Use path.join to ensure it always points to the server's uploads folder
        cb(null, path.join(path.resolve(), 'uploads/')); 
    },
    filename(req, file, cb) {
        // Name the file: image-123456789.jpg
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. Validate File Type (Images Only)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    // Check extension (.jpg)
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mimetype (image/jpeg)
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

// 3. Initialize Multer
const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// 4. The Route
// The frontend will send a file with the key name 'image'
router.post('/', upload.single('image'), (req, res) => {
    // Send back the path so the frontend can save it in the Product DB
    res.send(`/${req.file.path}`);
});

module.exports = router;