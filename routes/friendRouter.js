"use strict";

const express = require("express");
const router = express.Router();
const friend_ctrl = require("../controller/friend_ctrl");

//친구 요청
router.post('/req_friend', friend_ctrl.req_friend);

//친구 요청에 대한 응답
router.post('/res_friend', friend_ctrl.res_friend);

//친구 리스트 보여주기
router.get('/list_friend/:user_key', friend_ctrl.list_friend);

//친구 삭제
router.post('/del_friend', friend_ctrl.del_friend);

//친구 채팅
router.get('/friend_chat/:user_key/:friend_key', friend_ctrl.chat_friend);

module.exports = router;