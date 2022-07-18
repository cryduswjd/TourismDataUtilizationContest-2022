"use strict"

const chatDAO = require("../model/chatDAO");

async function chat_list_read(req, res, next) {
    try {
        const user_key = req.params.user_key;
        const db_data = await chatDAO.chat_listR(user_key);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("채팅 리스트를 불러올 수 없습니다.");
    }
}

async function chat_read(req, res, next) {
    try {
        const room_key = req.params.room_key;
        const db_data = await chatDAO.chat_read_each(room_key);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("채팅을 불러올 수 없습니다.");
    }
}

module.exports = {
    chat_list_read,
    chat_read
}