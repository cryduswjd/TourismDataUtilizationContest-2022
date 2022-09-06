"use strict";

const admin = require("firebase-admin");

let serAccount = require("../record_movie.json");
admin.initializeApp({
    credential: admin.credential.cert(serAccount),
});

module.exports = { 
    admin
};