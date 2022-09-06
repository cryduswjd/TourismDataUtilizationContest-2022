"use strict";

const express = require("express");
const router = express.Router();
const mypage_ctrl = require("../controller/mypage_ctrl");

//첫 로그인 시 마이페이지에 담기는 정보들 get
router.post("/first_login_userInfo", mypage_ctrl.first_login_userInfo);
//마이페이지 수정(기본 정보는 카카오 로그인할 때 담긴다)
router.post("/profile_modify", mypage_ctrl.profile_modify);
//마이페이지
router.get("/show_me", mypage_ctrl.show_me);


//마이페이지에서 훈장 골랐을 때 위치 저장
router.post("/deco_index", mypage_ctrl.deco_index)
//마이페이지에서 고른 훈장 계속 보여줄 때
router.get("/select_my_deco", mypage_ctrl.select_my_deco);

module.exports = router;