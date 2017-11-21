var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
var jwt = require('jsonwebtoken');
require('../server/config/passport')(passport);

router.post('/login', function(req, res, next) {
   passport.authenticate('local-signin', function(err, user, info) {
     console.log(info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json(401, { error: err });
    }

    var userDto = {
      firstName: user.firstname,
      lastName: user.lastname,
      userName: user.username,
      id: user.id,
      email: user.email
    }

    var token = jwt.sign(userDto, process.env.JWT_SECRET || 'devsecret', { expiresIn: 60 * 24 * 7 });
    res.json({ token: token });
   })(req, res, next);
});

router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup'
}));

module.exports = router;
