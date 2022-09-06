"use strict";

const {db} = require("../config/dbconn");

function first_login_getInfo(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO user_detail(user_key, sex, tag, mbti, intro, token) values (?, ?, ?, ?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.sex, parameter.tags, parameter.mbti, parameter.intro, parameter.token], (err, db_data) => {
            if (err) reject(err);
            else resolve(db_data);
        })
    })
}

function user_profile_modify(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE user SET nickname = ? where user_key = ?`;
        db.query(queryData, [parameter.nickname, parameter.user_key], (err, db_data) => {
            if (err) reject(err);
            else resolve(db_data);
        })
    })
}

function user_detail_profile_modify(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE user_detail SET mbti = ?, tag = ?, intro = ? where user_key = ?`;
        db.query(queryData, [parameter.mbti, parameter.tags, parameter.intro, parameter.user_key], (err, db_data) => {
            if (err) reject(err);
            else resolve(db_data);
        })
    })
}

function show_me(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname, img, mbti, intro, tag FROM user LEFT OUTER JOIN user_detail ON user_detail.user_key = user.user_key where user.user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data)
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function read_deco_list_key(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT deco_list_key FROM decoration_list where user_key = ? AND deco_key = ?`;
        db.query(queryData, [parameter.user_key, parameter.deco_key], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function change_null(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE decoration_list SET deco_index = NULL where user_key = ? AND deco_index = ?`;
        db.query(queryData, [parameter.user_key, parameter.index], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function insert_deco_index(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE decoration_list SET deco_index = ? where deco_list_key = ?`;
        db.query(queryData, [parameter.index, parameter.deco_list_key], (err, db_data) => {
            if(err) reject;
            else resolve(db_data);
        })
    })
}

function inform_deco_index(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT deco_key, deco_index FROM decoration_list where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

module.exports = {
    first_login_getInfo,
    user_profile_modify,
    user_detail_profile_modify,
    show_me,
    read_deco_list_key,
    change_null,
    insert_deco_index,
    inform_deco_index
}