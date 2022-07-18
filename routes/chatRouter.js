"use strict";

const express = require("express");
const router = express.Router();
const chat_ctrl = require("../controller/chat_ctrl");

// 채팅리스트 보여주기
router.get('/chat_list/:user_key', chat_ctrl.chat_list_read);

// 채팅리스트 중 하나 눌렀을 때 채팅방으로
router.get('/chat_list_each/:room_key', chat_ctrl.chat_read);

module.exports = router;