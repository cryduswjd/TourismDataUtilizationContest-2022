"use strict";

const SocketIO = require('socket.io');
const accompanyDAO = require('../model/accompanyDAO');
const chatDAO = require('../model/chatDAO');
const alarmDAO = require('../model/alarmDAO');

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

            if ( msg.type == 1 ) { 
                const check_host = await accompanyDAO.companion_postD_check_identity(parameters.post_key);
                if(parameters.user_key != check_host[0].user_key) {
                    const join_db_data = await chatDAO.chatRoom_companion(parameters);
                }
                const plus_personnel = await chatDAO.plus_personnel(parameters.room_key);
            }
            if ( msg.type == 2 ) { 
                const join_db_data = await chatDAO.chatRoom_friend(parameters);
            }
            
            console.log('room_key: ', parameters.room_key)
            socket.join(parameters.room_key);

            let nickname = await chatDAO.modify_user_name(parameters.user_key);
            nickname = nickname[0].nickname;
            let asd = nickname +'님이 방에 입장하였습니다.';
            io.to(parameters.room_key).emit('noti_join_room', asd);
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
            const read_content_data = await chatDAO.read_content(parameter.user_key);
            const sent_users = await chatDAO.read_user(parameter.room_key);
            
            const sent_user = [];

            for(let i=0; i<sent_users.length; i++) {
                sent_user.push(sent_users[i].user_key);
            }

            for(let i=0; i<read_content_data.length; i++) {
                if (sent_user[i] != parameter.user_key) {
                    let parameter = {
                        user_key: read_content_data[i].user_key,
                        sent_user: sent_user[i],
                        msg: read_content_data[i].msg,
                        time: read_content_data[i].date,
                        type: read_content_data[i].type
                    }
                    console.log(parameter.sent_user)
                    let alarm_data = await alarmDAO.chating_save(parameter);
                }
            }
    
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
    });
};