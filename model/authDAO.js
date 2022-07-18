"use strict";

const db = require("../config/dbconn");

function add_account(parameter) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM user WHERE id = ?`, [parameter.id], (err, db_data) => {
            console.log(db_data);
            if(db_data.length == 0) {
                console.log(db_data);
                db.query('INSERT INTO user(id, nickname, img) values (?, ?, ?)', [parameter.id, parameter.nickname, parameter.img]);
                resolve(db_data);
            }
            else reject(err);
        })
    });
}

module.exports = {  
    add_account
}