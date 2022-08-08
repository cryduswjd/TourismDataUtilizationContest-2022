"use strict";

const db = require("../config/dbconn");

function chating_save (parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start P");
        const queryData = `INSERT INTO alarm (user_key, sent_key, msg, time, type) values (?, ?, ?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.sent_user, parameter.msg, parameter.time, parameter.type], (err, db_data) => {
            if(db_data) {
                resolve(db_data);
            }
            else {
                reject(err);
            }
        })
    });
}

function friend_req_save(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO alarm (user_key, sent_key, msg, type) values (?, ?, ?, 1)`;
        db.query(queryData, [parameter.req_person, parameter.res_person, parameter.data], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function friend_res_save(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO alarm (user_key, sent_key, msg, type) values (?, ?, ?, 2)`;
        db.query(queryData, [parameter.user_key, parameter.del_friend, parameter.data], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function alarm_main_page(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT alarm.user_key, img, msg, time FROM alarm LEFT OUTER JOIN user ON alarm.user_key = user.user_key where alarm.user_key = ? ORDER BY time DESC`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data)
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function friend_req_alarm(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname, img FROM friend_list LEFT OUTER JOIN user ON friend_list.friend_2 = user.user_key where friend_1 = ? AND accept = 0`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function friend_res_alarm(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname, img FROM friend_list LEFT OUTER JOIN user ON friend_list.friend_2 = user.user_key where user_key = ? AND accept = 1 ORDER BY join_key DESC LIMIT 1`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function alarm_content(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT msg FROM alarm where alarm_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function alarm_type(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT msg, time FROM alarm where user_key = ? AND type = ?`;
        db.query(queryData, [parameter.user_key, parameter.type], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

module.exports = {
    chating_save,
    friend_req_save,
    friend_res_save,
    alarm_main_page,
    friend_req_alarm,
    friend_res_alarm,
    alarm_content,
    alarm_type
}