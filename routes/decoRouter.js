"use strict";

const express = require("express");
const router = express.Router();
const deco_ctrl = require("../controller/deco_ctrl");

//전체 훈장 리스트 보여주기
router.get('/show_deco_list', deco_ctrl.show_deco_list);

//내가 받은 훈장 리스트 보여주기
router.get('/show_my_deco', deco_ctrl.show_my_deco);

module.exports = router;