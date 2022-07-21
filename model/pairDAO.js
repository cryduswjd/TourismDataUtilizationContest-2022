"use strict";

const db = require("../config/dbconn");

function load_user_key(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT user_key FROM chat_list where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function load_user_id(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT id FROM user where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function insert_pair(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO pair_list(post_key, user_key, connect, trip_end) values (?, ?, ?, 0, 0)`;
        db.query(queryData, [parameter.post_key, parameter.user_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function insert_pair_hostV(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO pair_list(post_key, user_key, connect, trip_end) values (?, ?, ?, 1, 0)`;
        db.query(queryData, [parameter.post_key, parameter.user_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function qr_check_id(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT id FROM user where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function user_check(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT id FROM chat_list LEFT OUTER JOIN user ON chat_list.user_key = user.user_key where post_key = ? AND id = ?`;
        db.query(queryData, [parameter.post_key, parameter.qr], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function get_user_key(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT user_key FROM user where id = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function user_connect(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `UPDATE pair_list SET connect = 1 where post_key =? AND user_key = ?`;
        db.query(queryData, [parameter.post_key, parameter.id_to_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function user_connect_zero(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `UPDATE pair_list SET connect = 0 where post_key =? AND user_key = ?`;
        db.query(queryData, [parameter.post_key, parameter.user_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function pair_auth_stop(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `UPDATE pair SET type = 0 where post_key = ? AND user_key = ?`;
        db.query(queryData, [parameter.post_key, parameter.user_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function pair_auth_start(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `UPDATE pair SET type = 1 where post_key = ? AND user_key = ?`;
        db.query(queryData, [parameter.post_key, parameter.mate_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function save_photo(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO pair(mate_key, user_key, img, type) valuse (?, ?, ?, 1)`;
        db.query(queryData, [parameter.mate_key, parameter.user_key, parameter.string], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function load_photo(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT img FROM pair where mate_key = ? AND user_key = ? LIMIT ?, ?`;
        db.query(queryData, [parameter.mate_key, parameter.user_key, parameter.offset, parameter.limit], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function user_load_photo(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT name, user.img, pair.img FROM pair LEFT OUTER JOIN user ON pair.user_key = user.user_key where mate_key = ? AND user_key = ? LIMIT ?, ?`;
        db.query(queryData, [parameter.mate_key, parameter.user_key, parameter.offset, parameter.limit], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function save_todo(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO pair(mate_key, user_key, todo, type) valuse (?, ?, ?, 1)`;
        db.query(queryData, [parameter.mate_key, parameter.user_key, parameter.todo], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function load_todo(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT todo FROM pair where mate_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

module.exports = {
    load_user_key,
    load_user_id,
    insert_pair,
    insert_pair_hostV,
    qr_check_id,
    user_check,
    get_user_key,
    user_connect,
    user_connect_zero,
    pair_auth_stop,
    pair_auth_start,
    save_photo,
    load_photo,
    user_load_photo,
    save_todo,
    load_todo
}