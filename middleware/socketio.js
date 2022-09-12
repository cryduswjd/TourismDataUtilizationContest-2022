"use strict";

const SocketIO = require('socket.io');
const accompanyDAO = require('../model/accompanyDAO');
const chatDAO = require('../model/chatDAO');

module.exports = (server) => {
    const io = SocketIO(server);

    io.on('connection', (socket)=>{
        // 방참여 요청
        socket.on('req_join_room', async (msg) => {
            
            console.log('msg: ', msg)
            const parameters = {
                room_key: msg.room_key,
                user_key: msg.user_key,
                post_key: msg.post_key,
                title: msg.title,
                type: msg.type
            }
            
            console.log('room_key: ', parameters.room_key)
            socket.join(parameters.room_key);

            // let nickname = await chatDAO.modify_user_name(parameters.user_key);
            // nickname = nickname[0].nickname;
            // let asd = nickname +'님이 방에 입장하였습니다.';
            // io.to(parameters.room_key).emit('noti_join_room', asd);
        });
    
        // 채팅방에 채팅 요청
        socket.on('req_room_message', async(msg) => {
            const parameter = {
                room_key: msg.room_key,
                user_key: msg.user_key,
                msg: msg.msg
            }
            console.log(parameter)
            const msg_db_data = await chatDAO.chat_companion(parameter);
            const chat_key = msg_db_data.insertId;
            let db_data = await chatDAO.chat_companion_R(chat_key);
            db_data =  db_data[0]
            console.log('msg:', msg);

            io.to(parameter.room_key).emit('noti_room_message', db_data);
        });
    
        //채팅방 나가기 요청
        socket.on('exit_room', async(msg) => {
            const parameter = {
                room_key: msg.room_key,
                user_key: msg.user_key
            }
            console.log('test: ', parameter);
            const exit = await chatDAO.chat_exit(parameter);
            const minus_personnel = await chatDAO.minus_personnel(parameter.room_key);
            
            let nickname = await chatDAO.modify_user_name(parameter.user_key);
            nickname = nickname[0].nickname;
            let asd = nickname +'님이 방에 나갔습니다.';
            io.to(parameter.room_key).emit('noti_exit_room', asd);
        });

        //채팅방 내보내기 요청
        socket.on('export_room', async(msg) => {
            const parameter = {
                room_key: msg.room_key,
                user_key: msg.user_key
            }

            /////////// host만 가능하게 서버가 코드를 짤 경우 ////////////

            // //room_key로 post_key를 가져온다
            // let get_post_key = await chatDAO.get_post_key(parameter.room_key);
            // get_post_key = get_post_key[0].post_key;

            // //가져온 post_key로 user_key를 가져온다
            // let get_post_user_key = await chatDAO.get_post_user_key(get_post_key);
            // get_post_user_key = get_post_user_key[0].user_key;

            // const check_host = await chatDAO.check_host(parameter.user_key);

            // if(check_host[0].user_key == get_post_user_key) {
            //     const user_export = await chatDAO.chat_exit(parameter);
            //     const minus_personnel = await chatDAO.minus_personnel(parameter.room_key);

            //     let nickname = await chatDAO.modify_user_name(parameter.user_key);
            //     nickname = nickname[0].nickname;
            //     let asd = nickname +'님이 내보내졌습니다.';
            //     io.to(parameter.room_key).emit('noti_export_room', asd);
            // }
            
            // else {
            //     console.log(err);
            // }

            /////////// host만 가능하게 서버가 코드를 짤 경우 ////////////

            const user_export = await chatDAO.chat_exit(parameter);
            const minus_personnel = await chatDAO.minus_personnel(parameter.room_key);

            let nickname = await chatDAO.modify_user_name(parameter.user_key);
            nickname = nickname[0].nickname;
            let asd = nickname +'님이 내보내졌습니다.';
            io.to(parameter.room_key).emit('noti_export_room', asd);
        })
    });
};