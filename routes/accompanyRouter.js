"use strict";

const express = require("express");
const router = express.Router();
const accompany_ctrl = require("../controller/accompany_ctrl");

//동행 메인

//동행 게시글 쓰기o
router.post('/companionPostC', accompany_ctrl.companionPost_create);
//동행 게시글 수정o
router.post('/companionPostU/:post_key', accompany_ctrl.companionPost_update);
//동행 게시글 삭제o
router.post('/companionPostD/:post_key/:user_key', accompany_ctrl.companionPost_delete);
//하나의 동행 게시글 눌렀을 때o
router.get('/companionPostR/:post_key', accompany_ctrl.companionPost_read);
//동행 게시글 전체 보기o
router.get('/companionPostR_A', accompany_ctrl.companionPost_read_A);


//동행자 디테일

//동행 게시글 검색_아이디o
router.get('/companionPost_search_user', accompany_ctrl.companionPost_search_user);
//동행 게시글 검색_지역o
router.get('/companionPost_search_area', accompany_ctrl.companionPost_search_area);
//동행 게시글 마감하기 눌렀을 때
//router.post('/companionDeadline_Btn', accompany_ctrl.companionPost_Deadline_Btn);
//동행 채팅 참여 눌렀을 때 보여지는 화면과 socket 통신
router.get('/companionPostC_chat/:post_key/:user_key', accompany_ctrl.companionPost_createChat);

module.exports = router;
