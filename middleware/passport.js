"use strict";

const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;
const model = require("../model/authDAO");
require('dotenv').config();

passport.use('kakao', new KakaoStrategy({
    clientID: process.env.REST_API_KEY,
    callbackURL: process.env.REDIRECT_URI,
  },
  async (accessToken, refreshToken, profile, done) => {
    // console.log("accessToken: " + accessToken);
    // console.log("refreshToken: " + refreshToken);
    const parameter = {
      "id": profile.id,
      "nickname": profile.username,
      "img": profile._json.properties.profile_image
    }
    const account_data = await model.add_account(parameter);
    console.log(account_data);
}));

module.exports = passport;