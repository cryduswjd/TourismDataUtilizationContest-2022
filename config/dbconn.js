"use strict";

const mysql = require('mysql');
require('dotenv').config({ path: '.env'});

const dbOption = {
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}

const db = mysql.createConnection(dbOption);

module.exports = db;    