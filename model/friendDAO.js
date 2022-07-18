"use strict";

const db = require("../config/dbconn");

function req_friend(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO friend_list(friend_1, friend_2) values (?, ?)`;
        db.query(queryData, [parameter.req_person, parameter.res_person], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function res_friend_accept(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE friend_list SET accept = 1 where friend_1 = ? AND friend_2 = ?`;
        db.query(queryData, [parameter.del_friend, parameter.user_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function res_friend_accept_add(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO friend_list(friend_2, friend_1, accept) values (?, ?, 1)`;
        db.query(queryData, [parameter.del_friend, parameter.user_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function remove_firend(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `DELETE FROM friend_list where friend_1 = ? AND friend_2 = ?`;
        db.query(queryData, [parameter.del_friend, parameter.user_key], (err, db_data) => {
            console.log(db_data)
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function show_friend_list(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname FROM friend_list LEFT OUTER JOIN user ON friend_list.friend_2 = user.user_key WHERE accept = 1 AND friend_1 = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

module.exports = {
    req_friend,
    res_friend_accept,
    res_friend_accept_add,
    remove_firend,
    show_friend_list
}