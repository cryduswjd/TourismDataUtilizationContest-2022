"use strict"

const mypageDAO = require("../model/mypageDAO");

async function first_login_userInfo(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        let sex = req.body.sex;
        const tags = req.body.tags;
        const mbti = req.body.mbti;
        const intro = req.body.intro;
        const token = req.body.token;

        if (sex == "여") sex = 1
        else if (sex == "남") sex = 2

        const parameter = { user_key, sex, tags, mbti, intro, token };
        const db_data = await mypageDAO.first_login_getInfo(parameter);

        res.send({ result: "success" });
    } catch (err) {
        res.send({ result: "사용자 정보를 가져올 수 없음"})
    }
}

async function profile_modify(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const nickname = req.body.nickname;
        const mbti = req.body.mbti;
        const intro = req.body.intro;
        const tags = req.body.tags;
        
        const user_parameter = { user_key, nickname };
        let db_data = await mypageDAO.user_profile_modify(user_parameter);
        const detail_parameter = { user_key, mbti, tags, intro };
        db_data = await mypageDAO.user_detail_profile_modify(detail_parameter);

        res.send({ result: "success" });
    } catch(err) {
        res.send("사용자 정보 수정 오류");
    }
}

async function show_me(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const db_data = await mypageDAO.show_me(user_key);

        res.send( {result : db_data} )
    } catch(err) {
        res.send(err);
    }
}

async function deco_index(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const deco_key = req.body.deco_key;
        const index = req.body.index;
        let parameter = {};

        parameter = { user_key, index }
        let db_data = await mypageDAO.change_null(parameter);

        parameter = { user_key, deco_key };
        db_data = await mypageDAO.read_deco_list_key(parameter);

        const deco_list_key = db_data[0].deco_list_key;

        parameter = { deco_list_key, index };
        db_data = await mypageDAO.insert_deco_index(parameter);

        res.send({ result: "success" });
    } catch (err) {
        res.send("훈장 위치 오류")
    }
}

async function select_my_deco(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;

        const db_data = await mypageDAO.inform_deco_index(user_key);

        res.json({
            "db_data": db_data
        })
    } catch(err) {
        res.send("훈장 불러오기 오류");
    }
}

module.exports = {
    first_login_userInfo,
    profile_modify,
    show_me,
    deco_index,
    select_my_deco
}