"use strict";

const multer = require('multer');

const testUpload = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'public/images/');
    },
    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

const uploadAction = multer({ 
    storage: testUpload
});

module.exports = {
    uploadAction
}