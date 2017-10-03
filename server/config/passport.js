var LocalStrategy = require('passport-local').Strategy;
var database = require('./config.json')[process.env.NODE_ENV || 'development'];
var flash = require('connect-flash');
const Sequelize = require('sequelize');
var pg = require('pg').native;
var path = require('path');
const env = process.env.NODE_ENV || 'development';
var pghstore = require('pg-hstore');
const config = require(`${__dirname}/../config/config.json`)[env];

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    sequelize = new Sequelize(
        config.database, config.username, config.password, config
    );
}

var User = require('../models/User');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            done(null, user);
        }).catch(function (e) {
            done(e, false);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        function (req, email, password, done) {
            User.findOne({ where: { username: username } })
                .then(function (user) {
                    if (!user) {
                        done(null, false);
                    } else if (!user.validPassword(password)) {
                        done(null, false);
                    } else {
                        done(null, user);
                    }
                })
                .catch(function (e) {
                    done(null, false);
                });
        }
    ));

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: false
    },
        function (req, email, password, done) {
            User.findOne({ where: { email: email } })
                .then(function (existingUser) {
                    if (existingUser)
                        return done(null, false);
                    if (req.user) {
                        var user = req.user;
                        user.email = email;
                        user.password = User.generateHash(password);
                        user.save().catch(function (err) {
                            throw err;
                        }).then(function () {
                            done(null, user);
                        });
                    }
                    else {
                        var newUser = User.build({ email: email, username: username, firstname: firstname, lastname: lastname, password: User.generateHash(password) });
                        newUser.save().then(function () { done(null, newUser); }).catch(function (err) { done(null, false); });
                    }
                })
                .catch(function (e) {
                    done(null, false);
                })
        })
    );
};