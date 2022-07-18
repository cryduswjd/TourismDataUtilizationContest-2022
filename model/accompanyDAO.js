"use strict";

const db = require("../config/dbconn");

function companion_postC(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO accompany(user_key, title, des, personnel, tag) values (?, ?, ?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.title, parameter.des, parameter.personnel, parameter.tag], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postU(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `UPDATE accompany SET user_key = ?, title = ?, des = ?, personnel = ?, tag = ? where post_key = ?`;
        db.query(queryData, [parameter.user_key, parameter.title, parameter.des, parameter.personnel, parameter.tag, parameter.post_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postD_check_identity(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT user_key FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postD_check_admin(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT admin FROM user where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postD(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `DELETE FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postR(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname, title, des, personnel, tag, date_upload, date_update FROM accompany LEFT OUTER JOIN user ON accompany.user_key = user.user_key Where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postR_A(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname, title, des, personnel, date_update FROM accompany LEFT OUTER JOIN user ON accompany.user_key = user.user_key LIMIT ?, ?`;
        db.query(queryData, [parameter.offset, parameter.limit], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_search_user(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT nickname FROM user where nickname LIKE ? LIMIT ?, ?`;
        db.query(queryData, [`%${parameter.search_user}%`, parameter.offset, parameter.limit], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_search_area(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT nickname, title, des, personnel, date_update FROM accompany 
                        LEFT OUTER JOIN user ON accompany.user_key = user.user_key where title LIKE ? LIMIT ?, ?`;
        db.query(queryData, [`%${parameter.search_area}%`, parameter.offset, parameter.limit], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

module.exports = {  
    companion_postC,
    companion_postU,
    companion_postD_check_identity,
    companion_postD_check_admin,
    companion_postD,
    companion_postR,
    companion_postR_A,
    companion_search_user,
    companion_search_area
}