"use strict";

const express = require("express");
const router = express.Router();
const pair_ctrl = require("../controller/pair_ctrl");

//큐알 값(user_id) 보내주기 - 사용자버전
router.get('qr_info/:user_key', pair_ctrl.qr_info);
//큐알 체크 - 호스트버전
router.post('/qr_check/:post_key', pair_ctrl.qr_check);


//비활성화 시키기
router.post('/user_disable/:post_key/:mate_key', pair_ctrl.user_disable);
//재활성화(여행시작 누를때마다 -> 잘못 x버튼을 눌렀을 경우)
router.post('/user_restart/:post_key/:mate_key', pair_ctrl.user_restart);

//사진 공유 (짝궁 메인 sql_paging 4개씩)

//todo 리스트 공유

//사진 공유 (짝궁 메인에서 전체 보기 눌렀을 때)

module.exports = router;