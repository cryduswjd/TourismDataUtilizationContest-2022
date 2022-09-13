"use strict";

const {db} = require("../config/dbconn");

//채팅방 리스트
function chat_listR(parameter) {
    return new Promise((resolve, reject) => {
        const queryData =  `SELECT room_key, accompany.user_key, chat_list.title, chat_list.post_key, chat_list.type,
                            (SELECT user.nickname from chat_list left join user on accompany.user_key = user.user_key order by personnel DESC limit 1 ) AS nickname,
                            (SELECT user.img from chat_list left join user on accompany.user_key = user.user_key order by personnel DESC limit 1 ) AS img
                            FROM chat_list
                            LEFT OUTER JOIN accompany on chat_list.post_key = accompany.post_key
                            where chat_list.user_key = ?
                            ORDER BY room_key DESC`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//채팅방
function chat_read_each(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key, nickname, msg, date FROM chating 
        LEFT OUTER JOIN user on chating.user_key = user.user_key
        where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//친구 채팅방 소켓으로 넘겨줄 때 필요한 값 받아오기
function chat_listR_socket(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT room_key, title, type FROM chat_list where type = 2 AND user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//동행 게시글 post_key로 채팅 리스트의 room_key 가져오기
function chat_list_key(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT DISTINCT room_key, post_key, title, type FROM chat_list where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//동행 참여인원 +
function plus_personnel(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE chat_list SET personnel = personnel + 1 where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//동행 참여인원 -
function minus_personnel(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE chat_list SET personnel = personnel - 1 where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//동행 채팅방 리스트
function chat_list_accompanyC(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO chat_list(room_key, user_key, post_key, title, type) values (?, ?, ?, ?, 1)`;
        db.query(queryData, [parameter.room_key, parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//동행 채팅방 리스트(host)
function chat_listC_host(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO chat_list(user_key, post_key, title, type, personnel) values (?, ?, ?, 1, 0)`;
        db.query(queryData, [parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//채팅 리스트 정보 불러오기
function chat_list_info(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT room_key, user_key, post_key, title, type FROM chat_list where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

//채팅방 내 메시지 DB 삽입
function chat_companion(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO chating(user_key, room_key, msg) values (?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.room_key, parameter.msg], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

function chat_companion_R(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT chat_key, chating.user_key as user_key, msg, date_format(date, '%Y-%m-%d %T') as date, nickname, img FROM chating LEFT OUTER JOIN user ON chating.user_key = user.user_key where chat_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

//type 1: 동행채팅, type2: 친구채팅 
function chatRoom_companion(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO chat_list(room_key, user_key, post_key, title, type) values (?, ?, ?, ?, 1)`;
        db.query(queryData, [parameter.room_key, parameter.user_key, parameter.post_key, parameter.title], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//친구 채팅방 리스트
function chat_list_friendC(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO chat_list(user_key, title, type) values (?, ?, 2)`;
        db.query(queryData, [parameter.user_key, parameter.load_name], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//친구 이름 불러오기
function listC_load_name(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname FROM user where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
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
        const queryData = `INSERT INTO chat_list(user_key, post_key, title, type) values (?, 0, ?, 2)`;
        db.query(queryData, [parameter.user_key, parameter.title], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

//채팅 내용 불러오기
function read_content(paramter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT chating.user_key, msg, date, type FROM chating LEFT OUTER JOIN chat_list ON chating.room_key = chat_list.room_key where chating.user_key = ?`;
        db.query(queryData, [paramter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

//채팅방에 있는 모든 사람 불러오기
function read_user(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key FROM chat_list where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function modify_user_name(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname FROM user where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function chat_exit(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `DELETE FROM chat_list where room_key = ? AND user_key = ?`;
        db.query(queryData, [parameter.room_key, parameter.user_key], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    })
}

function chat_list_room_key(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT DISTINCT room_key, post_key, title, type FROM chat_list where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

/////////// host만 가능하게 서버가 코드를 짤 경우 ////////////
function get_post_key(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT post_key FROM chat_list where room_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function get_post_user_key(parameter) {
    return new Promise((resolve, rejcet) => {
        const queryData = `SELECT user_key FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function check_host(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT `;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}
/////////// host만 가능하게 서버가 코드를 짤 경우 ////////////

function already_room(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT count(room_key) as cnt FROM chat_list where user_key = ? AND post_key = ?`;
        db.query(queryData, [parameter.user_key, parameter.post_key], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function participant_list(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key FROM chat_list where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

module.exports = {  
    chat_listR,
    chat_read_each,
    chat_listR_socket,
    chat_list_key,
    plus_personnel,
    minus_personnel,
    chat_list_accompanyC,
    chat_listC_host,
    chat_list_info,
    chat_companion,
    chat_companion_R,
    chatRoom_companion,
    chat_list_friendC,
    listC_load_name,
    chatRoom_friend,
    read_content,
    read_user,
    modify_user_name,
    chat_exit,
    chat_list_room_key,
    get_post_key,
    get_post_user_key,
    check_host,
    already_room,
    participant_list
}