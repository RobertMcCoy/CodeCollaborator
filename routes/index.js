var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
require('../server/config/passport')(passport);

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/'
}), () => (console.log('logged in')));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/'
}), () => (console.log('registered')));

router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + "/../build/index.html"));
});

module.exports = router;
