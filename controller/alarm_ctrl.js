"use strict";

const alarmDAO = require("../model/alarmDAO");

async function alarm_main(req, res, next) {
    try {
        const user_key = req.params.user_key;
        const db_data = await alarmDAO.alarm_main_page(user_key);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("알림 전체 정보 불러오기 오류");
    }
}

async function send_alarm(req, res, next) {
    try {
        const user_key = req.params.user_key;
        const type = req.params.type;
        const parameter = { user_key, type };

        const db_data = await alarmDAO.alarm_type(parameter);
        res.json({
            "db_data": db_data
        })
    } catch (err) {
        res.send("알림 정보 불러오기 오류");
    }
}

module.exports = {
    alarm_main,
    send_alarm
}