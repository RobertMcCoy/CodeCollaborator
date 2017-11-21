var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
require('../server/config/passport')(passport);

router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup'
}));

module.exports = router;
