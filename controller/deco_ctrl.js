"use strict";

const decoDAO = require("../model/decoDAO");

async function show_deco_list(req, res, next) {
    try {
        const db_data = await decoDAO.read_deco_list();

        res.json({
            "db_data": db_data
        })
    } catch (err) {
        res.send("훈장 리스트 불러오기 오류");
    }
}

async function show_my_deco(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const db_data = await decoDAO.read_user_deco(user_key);

        res.json({
            "db_data": db_data
        })
    } catch (err) {
        res.send("개인 훈장 리스트 불러오기 오류");
    }
}

module.exports = {
    show_deco_list,
    show_my_deco
}