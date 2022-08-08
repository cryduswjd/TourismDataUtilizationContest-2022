"use strict"

const accompanyDAO = require("../model/accompanyDAO");
const chatDAO = require("../model/chatDAO");
const pairDAO = require("../model/pairDAO");

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

async function accompany_main(req, res, next) {
    try {
        //추천 친구 추후에
        //
        let currentPage = req.query.page;
        const pageSize = 3;
        const page = paging(currentPage, pageSize);

        const parameter = {
            offset: page.offset,
            limit: page.limit
        }

        const real_time_upload_post = await accompanyDAO.read_upload_post(parameter);
        const closing_post = await accompanyDAO.read_closing_post(parameter);

        const real_time_data = real_time_upload_post;
        const closing_data = closing_post;

        res.json({
            "real_time_data": real_time_data,
            "closing_data": closing_data
        })
    } catch (err) {
        res.send("메인 페이지 오류")
    }
}

async function companionPost_create(req, res, next) {
    try {
        const user_key = req.body.user_key;
        const title = req.body.title;
        const des = req.body.des;
        const personnel = req.body.personnel;
        const tags = req.body.tags;
        const parameter = { user_key, title, des, personnel, tags };

        const db_data = await accompanyDAO.companion_postC(parameter);
        const post_key = db_data.insertId;

        const tag = tags.split(', ');
        const tag_lenght = tag.length;

        for(let i=0; i<tag_lenght; i++) {
            let tagg = tag[i];
            const tag_parameter = { post_key, tagg };
            const tag_data = await accompanyDAO.insert_tag(tag_parameter);
        };

        res.send("success");
    } catch (err) {
        console.log(err)
        res.send("게시글 업로드 오류");
    }
}

async function host_accompany_chat(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;

        const accompany_data = await accompanyDAO.accompany_info(post_key);
        const insert_accompany_data = await chatDAO.chat_listC_host(accompany_data[0]);
        
        let db_data = await chatDAO.chat_list_info(post_key);
        db_data = db_data[0];

        res.render("socket_test", { db_data, user_key });
    } catch (err) {
        res.send("작성자 채팅방 생성 오류");
    }
}

async function companionPost_update(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.body.user_key;
        const title = req.body.title;
        const des = req.body.des;
        const personnel = req.body.personnel;
        const tags = req.body.tags;

        const parameter = { post_key, user_key, title, des, personnel, tags };

        const del_tag = await accompanyDAO.delete_tag(post_key);

        const tag = tags.split(', ');
        const tag_lenght = tag.length;

        for(let i=0; i<tag_lenght; i++) {
            let tagg = tag[i];
            const tag_parameter = { post_key, tagg };
            const tag_data = await accompanyDAO.insert_tag(tag_parameter);
        }

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
        const user_key = await accompanyDAO.companion_postD_check_identity(post_key);
        const db_data = await accompanyDAO.companion_postR(post_key);

        res.json({
            "db_data": db_data,
            "user_key": user_key,
            "post_key": post_key
        });
    } catch (err) {
        res.send("읽어올 수 없습니다.");
    }
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

        const db_data = await accompanyDAO.companion_postR_A(parameter);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("읽어올 수 없습니다.");
    }
}

async function profile_detail(req, res, next) {
    try {
        const user_key = req.params.user_key;
        //방명록에서 사진도 불러와야 함(나경이 코드?)
        //user DB에 레벨, 훈장, 고도 추가해야함?
        const db_data = await accompanyDAO.companion_detail(user_key);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("프로필을 읽어올 수 없습니다.");
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

        const db_data = await accompanyDAO.companion_search_area(parameter);
        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("지역을 입력하세요.");
    }
}

//마감하기 버튼 누를때 짝궁 리스트업 - 호스트버전
async function companionPost_Deadline_Btn(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const host = req.params.user_key;
        const mate_key = await pairDAO.load_user_key(post_key);
        const mate_length = mate_key.length;

        let parameter = { post_key, host };
         //host는 connect 기본 1로 insert 해둔다
        const host_data = await pairDAO.insert_pair_hostV(parameter);

        for(let i=0; i<mate_length; i++) {
            if (mate_key[i].user_key != host) {
                parameter = {
                    post_key: post_key,
                    user_key: mate_key[i].user_key
                }
                // chat_list에 있는 user_key 모두 pair로 insert
                const db_data = await pairDAO.insert_pair(parameter);
            }
        }

        parameter = { post_key, host };
        const deadline = await accompanyDAO.check_deadline(parameter);

        res.send("success");
    } catch (err) {
        res.send("error");
    }
}

//마감 인원 보여주기
async function closing_people(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const personnel = await accompanyDAO.check_personnel(post_key);
        const close_personnel = await accompanyDAO.check_close_personnel(post_key);
        const db_data = { personnel, close_personnel };

        res.json({
            "db_data": db_data
        })
    } catch (err) {
        res.send("마감 인원 불러오기 오류");
    }
}

//채팅방 (게시글에서 확인버튼을 눌렀을 때) - 유저버전
async function companionPost_createChat(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = req.params.user_key;
        let db_data = await chatDAO.chat_list_key(post_key);
        db_data = db_data[0];

        res.render("socket_test", { db_data, user_key });
    } catch (err) {
        res.send("통신 오류");
    }
}

module.exports = {
    accompany_main,
    companionPost_create,
    host_accompany_chat,
    companionPost_update,
    companionPost_delete,
    companionPost_read,
    companionPost_read_A,
    profile_detail,
    companionPost_search_user,
    companionPost_search_area,
    companionPost_Deadline_Btn,
    closing_people,
    companionPost_createChat
}