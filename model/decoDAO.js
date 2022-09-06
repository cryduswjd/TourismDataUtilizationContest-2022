"use strict";

const {db} = require("../config/dbconn");

function read_deco_list() {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT deco_key, content FROM decoration`;
        db.query(queryData, (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function read_user_deco(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT deco_key FROM decoration_list where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function send_deco(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT deco_key, content FROM decoration where deco_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function insert_deco(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO decoration_list(user_key, deco_key) values (?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.deco_key], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    })
}

module.exports = {
    read_deco_list,
    read_user_deco,
    send_deco,
    insert_deco
}