"use strict";

const express = require("express");
const router = express.Router();
const account_ctrl = require("../controller/account_ctrl");

router.get("/", account_ctrl.main);

module.exports = router;