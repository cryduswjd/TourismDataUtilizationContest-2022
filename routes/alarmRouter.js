"use strict";

const express = require("express");
const alram_ctrl = require("../controller/alarm_ctrl");
const router = express.Router();

//알림 페이지
router.get('/alarm_main', alram_ctrl.alarm_main);

//알림 읽음 확인 && 알림 데이터로 가는 라우터
router.post('/check_alarm/:alarm_key', alram_ctrl.check_alarm);

module.exports = router;