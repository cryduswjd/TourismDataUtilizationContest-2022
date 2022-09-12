"use strict"

const accompanyDAO = require("../model/accompanyDAO");
const chatDAO = require("../model/chatDAO");
const pairDAO = require("../model/pairDAO");
const alarmDAO = require("../model/alarmDAO");
const decoDAO = require("../model/decoDAO");
const { admin } = require("../middleware/pushFcm");

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

// 추천 시스템
async function accompany_main_suggest(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const suggest_user = req.body.suggest_user;
        let users_info = [];

        for(let i=0; i<suggest_user.length; i++) {
            let user = await accompanyDAO.user_suggest(suggest_user[i]);
            users_info.push(user);
        }

        res.json({
            "user_key": user_key,
            "users_info": users_info
        });
    } catch (err) {
        res.send("추천 시스템 오류");
    }
}

async function companionPost_create(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const title = req.body.title;
        const des = req.body.des;
        const personnel = req.body.personnel;
        const tags = req.body.tags;
        const parameter = { user_key, title, des, personnel, tags };

        const db_data = await accompanyDAO.companion_postC(parameter);
        const post_key = db_data.insertId;
        

        if(tags) {
            const tag = tags.split(', ');
            const tag_lenght = tag.length;

            for(let i=0; i<tag_lenght; i++) {
                let tagg = tag[i];
                const tag_parameter = { post_key, tagg };
                const tag_data = await accompanyDAO.insert_tag(tag_parameter);
            };
        }

        const accompany_data = await accompanyDAO.accompany_info(post_key);
        const insert_accompany_data = await chatDAO.chat_listC_host(accompany_data[0]);

        const count_post = await accompanyDAO.count_post(user_key);
        let send_deco;
        let deco_data = "";
        let alarm_data = "";
        
        let get_token = await accompanyDAO.user_get_token(user_key);
        const target_token = get_token[0].token;

        if(count_post[0].cnt == 1) {
            send_deco = await decoDAO.send_deco(13); 
            deco_data = send_deco[0];

            alarm_data = await alarmDAO.alarm_content(4);
            alarm_data = alarm_data[0].msg;

            const msg = deco_data.content + " " + alarm_data;

            let parameter = { user_key, msg, post_key };
            const insert_alarm_data = await alarmDAO.deco_save(parameter);

            parameter = { user_key, deco_key: 13 };
            const db_daco = await decoDAO.insert_deco(parameter);

            const alarm_key = insert_alarm_data.insertId;

            let message = {
                notification: {
                  title: alarm_data,
                  body: deco_data.content,
                },
                token: target_token,
            }

            admin
            .messaging()
            .send(message)
            .then(function (response) {
                console.log('Successfully sent message: ', response)
                return res.json({ user_key, post_key })
            })
            .catch(function (err) {
                console.log('Error Sending message: ', err)
                return res.json({ result : false })
            });
        }

        else if(count_post[0].cnt == 5) { 
            send_deco = await decoDAO.send_deco(14); 
            deco_data = send_deco[0];

            alarm_data = await alarmDAO.alarm_content(4);
            alarm_data = alarm_data[0].msg;

            const msg = deco_data.content + " " + alarm_data;

            let parameter = { user_key, msg, post_key };
            const insert_alarm_data = await alarmDAO.deco_save(parameter);

            parameter = { user_key, deco_key: 14 };
            const db_daco = await decoDAO.insert_deco(parameter);

            const alarm_key = insert_alarm_data.insertId;

            let message = {
                notification: {
                  title: alarm_data,
                  body: deco_data.content,
                },
                token: target_token,
            }

            admin
            .messaging()
            .send(message)
            .then(function (response) {
                console.log('Successfully sent message: ', response)
                return res.json({ user_key, post_key })
            })
            .catch(function (err) {
                console.log('Error Sending message: ', err)
                return res.json({ result : false })
            });
        }

        else if(count_post[0].cnt == 10) { 
            send_deco = await decoDAO.send_deco(15);
            deco_data = send_deco[0];

            alarm_data = await alarmDAO.alarm_content(4);
            alarm_data = alarm_data[0].msg;

            const msg = deco_data.content + " " + alarm_data;

            let parameter = { user_key, msg, post_key };
            const insert_alarm_data = await alarmDAO.deco_save(parameter);

            parameter = { user_key, deco_key: 15 };
            const db_daco = await decoDAO.insert_deco(parameter);

            const alarm_key = insert_alarm_data.insertId;

            let message = {
                notification: {
                  title: alarm_data,
                  body: deco_data.content,
                },
                token: target_token,
            }

            admin
            .messaging()
            .send(message)
            .then(function (response) {
                console.log('Successfully sent message: ', response)
                return res.json({ user_key, post_key })
            })
            .catch(function (err) {
                console.log('Error Sending message: ', err)
                return res.json({ result : false })
            });
        }
        else {
            res.send({ user_key, post_key });
        }
    } catch (err) {
        console.log(err)
        res.send("게시글 업로드 오류");
    }
}

async function companionPost_update(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
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
        
        res.send({ result: "success" });
    } catch (err) {
        res.send("게시글 업데이트 오류");
    }
}

async function companionPost_delete(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
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
        res.send({ result: "success" });
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

async function companionPost_read_A_real_time(req, res, next) {
    try {
        let currentPage = req.query.page;
        const pageSize = 10;
        const page = paging(currentPage, pageSize);

        const parameter = {
            offset: page.offset,
            limit: page.limit
        }

        const db_data = await accompanyDAO.companion_postR_A_real_time(parameter);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("읽어올 수 없습니다.");
    }
}

async function companionPost_read_A_closing(req, res, next) {
    try {
        let currentPage = req.query.page;
        const pageSize = 10;
        const page = paging(currentPage, pageSize);

        const parameter = {
            offset: page.offset,
            limit: page.limit
        }

        const db_data = await accompanyDAO.companion_postR_A_closing(parameter);

        res.json({
            "db_data": db_data
        });
    } catch (err) {
        res.send("읽어올 수 없습니다.");
    }
}

async function profile_detail(req, res, next) {
    try {
        const companion_key = req.params.companion_key;
        const db_data = await accompanyDAO.companion_detail(companion_key);
        
        res.json({
            "result": db_data
        });
    } catch (err) {
        console.log(err)
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
        const host = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const mate_key = await pairDAO.load_user_key(post_key);
        const mate_length = mate_key.length;

        let parameter = { post_key, host };
        const deadline = await accompanyDAO.check_deadline(parameter);

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

        const mate_user = await pairDAO.get_mate_user(post_key);

        let send_deco = []; let deco_data = [];
        let alarm_data = []; let user_keys = [];
        let alarm_key;
        
        for(let i=0; i<mate_user.length; i++) {
            let count_user = await pairDAO.count_user(mate_user[i].user_key);
            let user_key = mate_user[i].user_key;;

            if(count_user[0].cnt == 1) {
                user_keys.push(user_key)
                let str = await decoDAO.send_deco(10);
                send_deco.push(str);
                str = str[0].content;
                deco_data.push(str);

                str = await alarmDAO.alarm_content(4);
                str = str[0].msg;
                alarm_data.push(str);

                const msg = deco_data[i] + " " + alarm_data[i];

                let parameter = { user_key, msg };
                const insert_alarm_data = await alarmDAO.deco_save(parameter);
            
                parameter = { user_key, deco_key: 10 };
                const db_deco = await decoDAO.insert_deco(parameter);

                alarm_key = insert_alarm_data.insertId;
            }

            else if(count_user[0].cnt == 5) {
                user_keys.push(user_key)
                let str = await decoDAO.send_deco(11);
                send_deco.push(str);
                str = str[0].content;
                deco_data.push(str);

                str = await alarmDAO.alarm_content(4);
                str = str[0].msg;
                alarm_data.push(str);

                const msg = deco_data[i] + " " + alarm_data[i];

                let parameter = { user_key, msg };
                const insert_alarm_data = await alarmDAO.deco_save(parameter);
            
                parameter = { user_key, deco_key: 11 };
                const db_deco = await decoDAO.insert_deco(parameter);

                alarm_key = insert_alarm_data.insertId;
            }

            else if(count_user[0].cnt == 10) {
                user_keys.push(user_key)
                let str = await decoDAO.send_deco(12);
                send_deco.push(str);
                str = str[0].content;
                deco_data.push(str);

                str = await alarmDAO.alarm_content(4);
                str = str[0].msg;
                alarm_data.push(str);

                const msg = deco_data[i] + " " + alarm_data[i];

                let parameter = { user_key, msg };
                const insert_alarm_data = await alarmDAO.deco_save(parameter);
            
                parameter = { user_key, deco_key: 12 };
                const db_deco = await decoDAO.insert_deco(parameter);

                alarm_key = insert_alarm_data.insertId;
            }
        }
        
        res.send({ user_keys, deco_data, alarm_data, alarm_key })
    } catch (err) {
        console.log(err)
        res.send("error");
    }
}

//채팅방 (게시글에서 확인버튼을 눌렀을 때) - 유저버전
async function companionPost_createChat(req, res, next) {
    try {
        const post_key = req.params.post_key;
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        
        //room_key, post_key, title, type
        let db_data = await chatDAO.chat_list_key(post_key);
        db_data = db_data[0];

        //다른 사람과 짝궁이 되어있는 상태인지 확인
        const check_pair = await pairDAO.check_other_pair(user_key);

        if(check_pair[0].cnt == 0) {
            const check_host = await accompanyDAO.companion_postD_check_identity(post_key);

            const parameter = { room_key: db_data.room_key, user_key, post_key: db_data.post_key, title: db_data.title };

            if(user_key != check_host[0].user_key) {
                const join_db_data = await chatDAO.chatRoom_companion(parameter);
            }
            const plus_personnel = await chatDAO.plus_personnel(db_data.room_key);

            res.json({ 
                "db_data": db_data,
                "user_key": user_key,
                "result": "짝궁 가능"
            });
        }
        else {
            res.json({ 
                "db_data": db_data,
                "user_key": user_key,
                "result": "짝궁 불가"
            });
        }
    } catch (err) {
        res.send("통신 오류");
    }
}

module.exports = {
    accompany_main,
    accompany_main_suggest,
    companionPost_create,
    companionPost_update,
    companionPost_delete,
    companionPost_read,
    companionPost_read_A_real_time,
    companionPost_read_A_closing,
    profile_detail,
    companionPost_search_user,
    companionPost_search_area,
    companionPost_Deadline_Btn,
    companionPost_createChat
}