"use strict";

const db = require("../config/dbconn");
//채팅방 리스트
function chat_listR(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT chat_list.title, nickname, img FROM chat_list 
        LEFT OUTER JOIN user on chat_list.user_key = user.user_key 
        LEFT OUTER JOIN accompany on chat_list.post_key = accompany.post_key
        where chat_list.user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//채팅방
function chat_read_each(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT nickname, msg, date FROM chating 
        LEFT OUTER JOIN user on chating.user_key = user.user_key
        where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//친구 채팅방 소켓으로 넘겨줄 때 필요한 값 받아오기
function chat_listR_socket(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT room_key, post_key, title, type FROM chat_list where type = 2 AND user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//동행 게시글 post_key로 채팅 리스트의 room_key 가져오기
function chat_list_key(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT DISTINCT room_key, post_key, title, type FROM chat_list where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//동행 채팅방 리스트
function chat_list_accompanyC(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO chat_list(room_key, user_key, post_key, title, type) values (?, ?, ?, ?, 1)`;
        db.query(queryData, [parameter.room_key, parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            console.log(db_data);
            if(db_data){
                resolve(db_data);
            }
            else {
                reject(err);
            }
        })
    });
}

//동행 채팅방 리스트(host)
function chat_listC_host(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO chat_list(user_key, post_key, title, type) values (?, ?, ?, 1)`;
        db.query(queryData, [parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            console.log(db_data);
            if(db_data){
                resolve(db_data);
            }
            else {
                reject(err);
            }
        })
    });
}

//채팅방 내 메시지 DB 삽입
function chat_companion(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO chating(user_key, room_key, msg) values (?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.room_key, parameter.msg], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function chat_companion_R(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT * FROM chating where chat_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//type 1: 동행채팅, type2: 친구채팅 
function chatRoom_companion(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO chat_list(room_key, user_key, post_key, title, type) values (?, ?, ?, ?, 1)`;
        db.query(queryData, [parameter.room_key, parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//친구 채팅방 리스트
function chat_list_friendC(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO chat_list(user_key, title, type) values (?, ?, 2)`;
        db.query(queryData, [parameter.user_key, parameter.load_name], (err, db_data) => {
            console.log(db_data);
            if(db_data){
                resolve(db_data);
            }
            else {
                reject(err);
            }
        })
    });
}

//친구 이름 불러오기
function listC_load_name(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `SELECT nickname FROM user where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if(db_data){
                resolve(db_data);
            }
            else {
                reject(err);
            }
        })
    });
}

//type 1: 동행채팅, type2: 친구채팅 
function chatRoom_friend(parameter) {
    return new Promise((resolve, reject) => {
        console.log("db start p")
        const queryData = `INSERT INTO chat_list(user_key, post_key, title, type) values (?, ?, ?, 2)`;
        db.query(queryData, [parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

module.exports = {  
    chat_listR,
    chat_read_each,
    chat_listR_socket,
    chat_list_key,
    chat_list_accompanyC,
    chat_listC_host,
    chat_companion,
    chat_companion_R,
    chatRoom_companion,
    chat_list_friendC,
    listC_load_name,
    chatRoom_friend
}