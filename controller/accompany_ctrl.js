"use strict"

const accompanyDAO = require("../model/accompanyDAO");
const chatDAO = require("../model/chatDAO");
const socketio = require("../middleware/socketio");

async function companionPost_create(req, res, next) {
    try {
        const user_key = req.body.user_key;
        const title = req.body.title;
        const des = req.body.des;
        const personnel = req.body.personnel;
        const tag = req.body.tag;
        const parameter = { user_key, title, des, personnel, tag };
        console.log(parameter);

        const db_data = await accompanyDAO.companion_postC(parameter);
        const post_key = db_data.insertId;
        const chat_parameter = {post_key, user_key, title }
        const chat_db_data = await chatDAO.chat_listC_host(chat_parameter);

        res.send("success");
    } catch (err) {
        res.send("게시글 업로드 오류");
    }
}

async function companionPost_update(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.body.user_key;
        const title = req.body.title;
        const des = req.body.des;
        const personnel = req.body.personnel;
        const tag = req.body.tag;
        const parameter = { post_key, user_key, title, des, personnel, tag };
        console.log(parameter);

        const db_data = await accompanyDAO.companion_postU(parameter);
        
        res.send("success");
    } catch (err) {
        res.send("게시글 업데이트 오류");
    }
}

async function companionPost_delete(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;
        //post를 한 사람의 user_key 불러오기
        let writer = await accompanyDAO.companion_postD_check_identity(post_key);
        writer = writer[0].user_key;

        //user_key의 권한 불러오기
        let check = await accompanyDAO.companion_postD_check_admin(user_key);
        check = check[0].admin;

        //권한이 0이거나, 본인의 게시글이라면 삭제 ok
        if(check == 0 || ( (user_key) == (writer)  )) {
            const db_data = await accompanyDAO.companion_postD(post_key);
        }
        res.send("success");
    } catch (err) {
        res.send("권한이 없습니다.");
    }
}

async function companionPost_read(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const db_data = await accompanyDAO.companion_postR(post_key);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("읽어올 수 없습니다.");
    }
}

const paging = (currentPage, pageSize) => {
    const default_start_page = 0;
    const page_size = pageSize;
    if (currentPage < 0 || !currentPage) currentPage = default_start_page;
    let result = {
        offset: (currentPage) * page_size,
        limit: Number(page_size)
    }
    return result;
}

async function companionPost_read_A(req, res, next) {
    try {
        let currentPage = req.query.page;
        const pageSize = 10;
        const page = paging(currentPage, pageSize);

        const parameter = {
            offset: page.offset,
            limit: page.limit
        }
        console.log(parameter);

        const db_data = await accompanyDAO.companion_postR_A(parameter);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("읽어올 수 없습니다.");
    }
}

async function companionPost_search_user(req, res, next) {
    try {
        let currentPage = req.query.page;
        const pageSize = 5;
        const page = paging(currentPage, pageSize);

        const parameter = {
            search_user: (req.query.search_user == undefined) ? "" : req.query.search_user,
            offset: page.offset,
            limit: page.limit
        }
        console.log(parameter);

        const db_data = await accompanyDAO.companion_search_user(parameter);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("사용자를 입력하세요.");
    }
}

async function companionPost_search_area(req, res, next) {
    try {
        let currentPage = req.query.page;
        const pageSize = 5;
        const page = paging(currentPage, pageSize);

        const parameter = {
            search_area: (req.query.search_area == undefined) ? "" : req.query.search_area,
            offset: page.offset,
            limit: page.limit
        }
        console.log(parameter);

        const db_data = await accompanyDAO.companion_search_area(parameter);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("지역을 입력하세요.");
    }
}

//짝궁 연결로 보류
// async function companionPost_Deadline_Btn(req, res, next) {
//     try {
        
//         res.render("main");
//     } catch (err) {
//         res.send("error");
//     }
// }

//채팅방 (게시글에서 확인버튼을 눌렀을 때)
async function companionPost_createChat(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;
        let db_data = await chatDAO.chat_list_key(post_key);
        db_data = db_data[0];

        res.send("socket_test", { db_data, user_key });
    } catch (err) {
        res.send("통신 오류");
    }
}

module.exports = {
    companionPost_create,
    companionPost_update,
    companionPost_delete,
    companionPost_read,
    companionPost_read_A,
    companionPost_search_user,
    companionPost_search_area,
    // companionPost_Deadline_Btn
    companionPost_createChat
}