var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
var jwt = require('jsonwebtoken');
require('../server/config/passport')(passport);

router.post('/login', function (req, res, next) {
  passport.authenticate('local-signin', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json(401, { error: err });
    }

    var payload = { id: user.id };

    var token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: 60 * 24 * 7 });
    res.json({ token: token });
  })(req, res, next);
});

router.post('/signup', function (req, res, next) {
  passport.authenticate('local-signup', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json(401, { error: err });
    }

    var payload = { id: user.id };
    
        var token = jwt.sign(payload, process.env.JWT_SECRET || 'devsecret', { expiresIn: 60 * 24 * 7 });
        res.json({ token: token });
  })(req, res, next);
});

module.exports = router;
