"use strict"

const chatDAO = require("../model/chatDAO");

async function chat_list_read(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        let chat_infos = await chatDAO.chat_listR(user_key);

        let post_user_infos = [];

        for(let i=0; i<chat_infos.length; i++) {
            let parameter = chat_infos[i].user_key;
            let post_user_info = await chatDAO.post_user_info(parameter);

            if(post_user_info.user_key == user_key) {
                let my_profile = await chatDAO.my_profile_info(user_key)
                post_user_infos.push(my_profile[0])
            } else {
                post_user_infos.push(post_user_info[0])
            }
        }

        res.json({
            "chat_info": chat_infos,
            "post_user_info": post_user_infos
        });
    } catch (err) {
        console.log(err)
        res.send("채팅 리스트를 불러올 수 없습니다.");
    }
}

async function chat_read(req, res, next) {
    try {
        const user_key = (req.get('user_key') != "" && req.get('user_key') != undefined) ? req.get('user_key') : null;
        const room_key = req.params.room_key;

        //소켓에 필요한 값 전달 room_key, post_key, title, type
        let db_data = await chatDAO.chat_list_room_key(room_key);
        db_data = db_data[0];

        //이전 소켓 데이터 값 전달 user_key, nickname, msg, date
        let pre_data = await chatDAO.chat_read_each(room_key);
        pre_data = pre_data[0];

        res.send({ pre_data, db_data, user_key });
    } catch (err) {
        res.send("채팅을 불러올 수 없습니다.");
    }
}

module.exports = {
    chat_list_read,
    chat_read
}