"use strict";

const express = require("express");
const router = express.Router();
const accompany_ctrl = require("../controller/accompany_ctrl");

//동행 메인o (추천 시스템 추가 x)
router.get('/accompany_main', accompany_ctrl.accompany_main);
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


//호스트가 게시글을 올리자마자 채팅방 입장
router.get('/host_accompany_chat/:post_key/:user_key', accompany_ctrl.host_accompany_chat);
//동행자 디테일 x
router.get('/companion_detail/:user_key', accompany_ctrl.profile_detail);
//동행 게시글 검색_아이디o
router.get('/companionPost_search_user', accompany_ctrl.companionPost_search_user);
//동행 게시글 검색_지역o
router.get('/companionPost_search_area', accompany_ctrl.companionPost_search_area);
//동행 게시글 마감하기 눌렀을 때 짝궁 리스트 업 & deadline DB=1로 update o
router.post('/companionDeadline_Btn/:post_key/:user_key', accompany_ctrl.companionPost_Deadline_Btn);
//동행 마감 인원o
router.get('/closing_people/:post_key', accompany_ctrl.closing_people);
//동행 채팅 참여 눌렀을 때 보여지는 화면과 socket 통신o 
//AND 채팅방 추방시키기 x
router.get('/companionPostC_chat/:post_key/:user_key', accompany_ctrl.companionPost_createChat);

module.exports = router;
