"use strict";

const express = require('express');
const app = express();
const path = require('path');
// const session = require('express-session');
// const FileStore = require('session-file-store')(session);
const main = require("./routes/user_account");
// const board = require("./routes/user_board");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// app.use(session({
//     secret: 'blackzat',
//     resave: false,
//     saveUninitialized: true,
//     store: new FileStore()
// }));

app.use("/", main);

module.exports = app;