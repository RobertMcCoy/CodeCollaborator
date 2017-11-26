var express = require('express');
var router = express.Router();
const passport = require('passport');
var path = require('path');
var jwt = require('jsonwebtoken');
require('../server/config/passport')(passport);

router.get('/profile', function(req, res, next) {
    passport.authenticate('jwt', {session: false}, 
        function(err, user) {
            if (!user) {
                return res.json(401, { error: err });
            }
            else {
                var userDto = {
                    createdDate: user.createdAt,
                    email: user.email,
                    firstName: user.firstname,
                    lastName: user.lastName,
                    userName: user.username
                }
                res.status(200).json(userDto)
            }
        })(req, res, next);
});

module.exports = router;