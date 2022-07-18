"use strict";

const SocketIO = require('socket.io');
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

            if ( msg.type == 1 ) { 
                const join_db_data = await chatDAO.chatRoom_companion(parameters);
            }
            if ( msg.type == 2 ) { 
                const join_db_data = await chatDAO.chatRoom_friend(parameters);
            }
            
            console.log('room_key: ', parameters.room_key)
            socket.join(parameters.room_key);

            let asd = msg["user_key"]+'님이 방에 입장하였습니다.';
            io.to(parameters.room_key).emit('noti_join_room', asd);
        });
    
        // 채팅방에 채팅 요청
        socket.on('req_room_message', async(msg) => {
            const parameter = {
                room_key: msg.room_key,
                user_key: msg.user_key,
                msg: msg.msg
            }
            const msg_db_data = await chatDAO.chat_companion(parameter);
            const chat_key = msg_db_data.insertId;
            let db_data = await chatDAO.chat_companion_R(chat_key);
            db_data =  db_data[0]
            console.log('msg:', msg);
            io.to(parameter.room_key).emit('noti_room_message', db_data);
        });
    
        socket.on('disconnect', async () => {
            console.log('user disconnected');
        });
    });
};