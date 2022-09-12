"use strict";

const {db} = require("../config/dbconn");

function read_user_key() {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key FROM user`;
        db.query(queryData, (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function user_suggest(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user.user_key, nickname, img, intro FROM user LEFT OUTER JOIN user_detail ON user_detail.user_key = user.user_key where user.user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function accompany_tag(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key, tag FROM accompany where user_key = ? AND tag IS NOT NULL`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function profile_tag(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key, tag FROM user_detail where user_key = ? AND tag IS NOT NULL`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function companion_postC(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `INSERT INTO accompany(user_key, title, des, personnel, tag) values (?, ?, ?, ?, ?)`;
        db.query(queryData, [parameter.user_key, parameter.title, parameter.des, parameter.personnel, parameter.tags], (err, db_data) => {
            console.log(db_data);
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function accompany_info(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key, post_key, title, personnel FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            console.log(db_data);
            if (db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function insert_tag(parameter) {
    return new Promise((resolve, reject) => {
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
        const queryData = `DELETE FROM tag where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postD_check_identity(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postD_check_admin(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT admin FROM user where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postD(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `DELETE FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function read_upload_post(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT accompany.user_key, post_key, nickname, img, title, des, accompany.personnel,
        (SELECT personnel FROM chat_list where (accompany.post_key = chat_list.post_key AND chat_list.personnel != 0)) AS count_personnel, date_format(date_update, '%Y-%m-%d %T') as date_update
        FROM accompany
        LEFT OUTER JOIN user ON accompany.user_key = user.user_key
        where accept = true AND deadline = 0
        ORDER BY date_upload DESC LIMIT ?, ?`;
        db.query(queryData, [parameter.offset, parameter.limit], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function read_closing_post(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT accompany.user_key, post_key, nickname, img, title, des, accompany.personnel,
        (SELECT personnel FROM chat_list where (accompany.post_key = chat_list.post_key AND chat_list.personnel != 0)) AS count_personnel, date_format(date_update, '%Y-%m-%d %T') as date_update
        FROM accompany
        LEFT OUTER JOIN user ON accompany.user_key = user.user_key
        where accept = true AND deadline = 0
        ORDER BY date_upload ASC LIMIT ?, ?`;
        db.query(queryData, [parameter.offset, parameter.limit], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function companion_postR(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT nickname, img, title, des, personnel, tag, date_format(date_upload, '%Y-%m-%d %T') as date_upload, date_format(date_update, '%Y-%m-%d %T') as date_update FROM accompany LEFT OUTER JOIN user ON accompany.user_key = user.user_key Where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postR_A_real_time(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT accompany.user_key, post_key, nickname, img, title, des, accompany.personnel,
                        (SELECT personnel FROM chat_list where (accompany.post_key = chat_list.post_key AND chat_list.personnel != 0)) AS count_personnel, date_format(date_update, '%Y-%m-%d %T') as date_update
                        FROM accompany
                        LEFT OUTER JOIN user ON accompany.user_key = user.user_key
                        where accept = true AND deadline = 0
                        ORDER BY date_upload DESC LIMIT ?, ?`;
        db.query(queryData, [parameter.offset, parameter.limit], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_postR_A_closing(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT accompany.user_key, post_key, nickname, img, title, des, accompany.personnel,
        (SELECT personnel FROM chat_list where (accompany.post_key = chat_list.post_key AND chat_list.personnel != 0)) AS count_personnel,
        date_format(date_update, '%Y-%m-%d %T') as date_update
        FROM accompany
        LEFT OUTER JOIN user ON accompany.user_key = user.user_key
        where accept = true AND deadline = 0
        ORDER BY CASE when (accompany.personnel-count_personnel)=1 then 1 
                      when (accompany.personnel-count_personnel)=2 then 2 
                      when (accompany.personnel-count_personnel)=3 then 3 
					  when (accompany.personnel-count_personnel)=4 then 4
                      when (accompany.personnel-count_personnel)=5 then 5
                      when (accompany.personnel-count_personnel)=6 then 6
                      when (accompany.personnel-count_personnel)=7 then 7
                      when (accompany.personnel-count_personnel)=8 then 8
                      when (accompany.personnel-count_personnel)=9 then 9
                      ELSE 10 END, date_upload ASC LIMIT ?, ?`;
        db.query(queryData, [parameter.offset, parameter.limit], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_detail(parameter) {
    return new Promise((resolve, reject) => {
        const qeuryData = 'SELECT nickname, img, mbti, intro, tag, temperature FROM user LEFT OUTER JOIN user_detail ON user_detail.user_key = user.user_key where user.user_key = ?';
        db.query(qeuryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function companion_search_user(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT user_key, nickname, img FROM user where nickname LIKE ? LIMIT ?, ?`;
        db.query(queryData, [`%${parameter.search_user}%`, parameter.offset, parameter.limit], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function companion_search_area(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT accompany.user_key, nickname, img, title, des, personnel, date_format(date_update, '%Y-%m-%d %T') as date_update FROM accompany 
                        LEFT OUTER JOIN user ON accompany.user_key = user.user_key where title LIKE ? LIMIT ?, ?`;
        db.query(queryData, [`%${parameter.search_area}%`, parameter.offset, parameter.limit], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function check_deadline(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `UPDATE accompany SET deadline = 1 where post_key = ? AND user_key = ?`;
        db.query(queryData, [parameter.post_key, parameter.host], (err, db_data) => {
            if(err) reject(err);
            else resolve(db_data);
        })
    });
}

function check_personnel(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT personnel FROM accompany where post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function check_close_personnel(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT chat_list.personnel FROM chat_list 
                           LEFT OUTER JOIN accompany ON chat_list.user_key = accompany.user_key
                           where accompany.post_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    });
}

function count_post(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT count(user_key) as cnt FROM accompany where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

function user_get_token(parameter) {
    return new Promise((resolve, reject) => {
        const queryData = `SELECT token FROM user_detail where user_key = ?`;
        db.query(queryData, [parameter], (err, db_data) => {
            if(db_data) resolve(db_data);
            else reject(err);
        })
    })
}

module.exports = {  
    read_user_key,
    user_suggest,
    accompany_tag,
    profile_tag,
    companion_postC,
    accompany_info,
    insert_tag,
    companion_postU,
    delete_tag,
    companion_postD_check_identity,
    companion_postD_check_admin,
    companion_postD,
    read_upload_post,
    read_closing_post,
    companion_postR,
    companion_postR_A_real_time,
    companion_postR_A_closing,
    companion_detail,
    companion_search_user,
    companion_search_area,
    check_deadline,
    check_personnel,
    check_close_personnel,
    count_post,
    user_get_token
}