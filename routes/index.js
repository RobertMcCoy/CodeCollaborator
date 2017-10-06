var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
require('../server/config/passport')(passport);

router.route('/login').post(passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/'
}), () => (console.log('logged in')));

router.route('/signup').post(passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/'
}), () => (console.log('registered')));

router.route('/').get(function (req, res) {
  console.log('main route hit');
  res.sendFile(path.join(__dirname + "/../build/index.html"));
});

module.exports = router;
