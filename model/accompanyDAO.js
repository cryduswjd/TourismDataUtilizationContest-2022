"use strict";

const db = require("../config/dbconn");

function companion_postC(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO accompany(user_key, title, des, personnel, tag) values (?, ?, ?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.title, parameter.des, parameter.personnel, parameter.tags], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function insert_tag(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO tag (post_key, tag_name) values (?, ?)`;
        db.query(queryData, [parameter.post_key, parameter.tagg], (err, db_data) => {
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
        db.query(queryData, [parameter.user_key, parameter.title, parameter.des, parameter.personnel, parameter.tags, parameter.post_key], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function delete_tag(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `DELETE FROM tag where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
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

function companion_detail(parameter) {
    return new Promise((resolve, reject) => {
        const qeuryData = 'SELECT nickname, img FROM user where user_key = ?';
        db.query(qeuryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
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

function check_deadline(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `UPDATE accompany SET deadline = 1 where post_key = ? AND user_key = ?`;
        db.query(queryData, [parameter.post_key, parameter.host], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function check_personnel(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT personnel FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function check_close_personnel(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT chat_list.personnel FROM chat_list 
                           LEFT OUTER JOIN accompany ON chat_list.user_key = accompany.user_key
                           where accompany.post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

module.exports = {  
    companion_postC,
    insert_tag,
    companion_postU,
    delete_tag,
    companion_postD_check_identity,
    companion_postD_check_admin,
    companion_postD,
    companion_postR,
    companion_postR_A,
    companion_detail,
    companion_search_user,
    companion_search_area,
    check_deadline,
    check_personnel,
    check_close_personnel
}