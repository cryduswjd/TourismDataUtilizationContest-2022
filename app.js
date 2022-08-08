"use strict";

const express = require('express');
const app = express();
const path = require('path');

const friendRouter = require("./routes/friendRouter");
const chatRouter = require("./routes/chatRouter");
const accompanyRouter = require("./routes/accompanyRouter");
const pairRouter = require("./routes/pairRouter");
const alarmRouter = require("./routes/alarmRouter");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use("/friend", friendRouter);
app.use("/chat", chatRouter);
app.use("/accompany", accompanyRouter);
app.use("/pair", pairRouter);
app.use("/alarm", alarmRouter);

module.exports = app;