"use strict";

const express = require("express");
const router = express.Router();
const main_ctrl = require("../controller/main_ctrl");

router.get('/', main_ctrl.main);

module.exports = router;