"use strict";

const {db} = require("../config/dbconn");

function chating_save(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO alarm (user_key, sent_key, msg, time, type) values (?, ?, ?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.sent_user, parameter.msg, parameter.time, parameter.type], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

function friend_req_save(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO alarm (user_key, msg, type, data_key) values (?, ?, 1, ?)`;
        db.query(queryData, [parameter.req_person, parameter.data, parameter.res_person], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    })
}

function friend_res_save(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO alarm (user_key, msg, type, data_key) values (?, ?, 2, ?)`;
        db.query(queryData, [parameter.user_key, parameter.data, parameter.del_friend], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    })
}

function alarm_main_page(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT alarm_key, alarm.user_key, img, msg, time, type, data_key FROM alarm 
                           LEFT OUTER JOIN user ON alarm.user_key = user.user_key 
                           where alarm.user_key = ? AND ORDER BY check_read ASC, time DESC`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function friend_req_alarm(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname FROM friend_list 
                           LEFT OUTER JOIN user ON friend_list.friend_1 = user.user_key 
                           where friend_1 = ? AND accept = 0`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function friend_res_alarm(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname FROM friend_list
                           LEFT OUTER JOIN user ON friend_list.friend_1 = user.user_key
                           where friend_1 = ? AND accept = 1`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function get_data_key(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT data_key, img as friend_img FROM alarm LEFT OUTER JOIN user ON alarm.user_key = user.user_key where alarm_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function alarm_content(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT msg FROM alarm where alarm_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function alarm_msg(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT msg, time FROM alarm where user_key = ? AND alarm_key = 0`;
        db.query(queryData, [parameter.user_key], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function deco_save(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO alarm (user_key, msg, type) values (?, ?, 4)`;
        db.query(queryData, [parameter.user_key, parameter.msg], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    })
}

function check_read(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE alarm SET check_read = 1 where alarm_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    })
}

function post_move(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT type, data_key FROM alarm where alarm_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

module.exports = {
    chating_save,
    friend_req_save,
    friend_res_save,
    get_data_key,
    alarm_main_page,
    friend_req_alarm,
    friend_res_alarm,
    alarm_content,
    alarm_msg,
    deco_save,
    check_read,
    post_move
}