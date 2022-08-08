"use strict";

const express = require("express");
const alram_ctrl = require("../controller/alarm_ctrl");
const router = express.Router();

//알림 페이지
router.get('/alarm_main/:user_key', alram_ctrl.alarm_main);
//알람 쏘기
router.get('/send_alarm/:user_key/:type', alram_ctrl.send_alarm);

module.exports = router;