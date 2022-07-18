"use strict";

const express = require('express');
const app = express();
const path = require('path');

const main = require("./routes/mainRouter");
const friendRouter = require("./routes/friendRouter");
const chatRouter = require("./routes/chatRouter");
const authRouter = require("./routes/authRouter");
const accompanyRouter = require("./routes/accompanyRouter");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/main", main);
app.use("/friend", friendRouter);
app.use("/chat", chatRouter);
app.use("/kakao", authRouter);
app.use("/accompany", accompanyRouter);

module.exports = app;