"use strict";

const express = require("express");
const router = express.Router();
// const auth_ctrl = require("../controller/auth_ctrl");
const passport = require("passport");

router.get('/', passport.authenticate('kakao'));
router.get('/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.render('main');
});

module.exports = router;