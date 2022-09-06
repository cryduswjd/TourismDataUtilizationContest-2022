"use strict";

const alarmDAO = require("../model/alarmDAO");

async function alarm_main(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const db_data = await alarmDAO.alarm_main_page(user_key);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("알림 전체 정보 불러오기 오류");
    }
}

async function check_alarm(req, res, next) {
    try {
        const alarm_key = req.params.alarm_key;

        const db_data = await alarmDAO.check_read(alarm_key);
        const result = await alarmDAO.post_move(alarm_key);

        res.json({
            "result": result
        })
    } catch (err) {
        res.send("알림 확인 오류");
    }
}

module.exports = {
    alarm_main,
    check_alarm
}