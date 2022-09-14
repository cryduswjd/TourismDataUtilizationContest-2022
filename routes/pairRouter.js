"use strict";

const express = require("express");
const router = express.Router();
const pair_ctrl = require("../controller/pair_ctrl");
const multer = require("../middleware/multer");

//짝궁 리스트 보여주기
router.get('/pair_list', pair_ctrl.pair_list);

//큐알 값(user_id) 보내주기 - 사용자버전
router.get('/qr_info', pair_ctrl.qr_info);
//큐알 체크 - 호스트버전
router.post('/qr_check/:post_key', pair_ctrl.qr_check);

//비활성화 시키기
router.post('/user_disable/:mate_key', pair_ctrl.user_disable);
//재활성화(여행시작 누를때마다 -> 잘못 x버튼을 눌렀을 경우)
router.post('/user_restart/:mate_key', pair_ctrl.user_restart);

//사진 공유 (짝궁 메인)
router.post('/photo_share/:post_key', multer.uploadAction.array("images", 10), pair_ctrl.photo_share);
//사진 공유 보여주기 (짝궁 메인 sql_paging 10개씩)
router.get('/show_photo/:mate_key', pair_ctrl.show_photo);
//사진 공유 (짝궁 메인에서 전체 보기 눌렀을 때)
router.get('/show_all_photo/:mate_key', pair_ctrl.show_all_photo);

//todo 리스트 공유
router.post('/todo_list/:post_key', pair_ctrl.todo_list);
//todo 리스트 보여주기
router.get('/show_todo_list/:mate_key', pair_ctrl.show_todo_list);

//짝궁 평가 할 때 짝궁 프로필 불러오기
router.get('/rating_user_info/:post_key', pair_ctrl.rating_user_info);
//짝궁 평가 (확인을 눌러서 DB에 저장됨과 동시에 connect=1로, trip_end=1로 update)
router.post('/pair_rate/:post_key', pair_ctrl.pair_rate);
//짝궁 평가 후 확인 눌렀을 때 연결 끊기
router.post('/disconnect_pair/:post_key', pair_ctrl.disconnect_pair);

module.exports = router;