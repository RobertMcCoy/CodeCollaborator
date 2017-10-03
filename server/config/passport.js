var LocalStrategy = require('passport-local').Strategy;
var database = require('./config.json')[process.env.NODE_ENV || 'development'];
var flash = require('connect-flash');
const Sequelize = require('sequelize');
var pg = require('pg');
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

var User = sequelize.import('../models/User');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, email, password, done) {
            User.findOne({ where: { localemail: email } })
                .then(function (user) {
                    if (!user) {
                        done(null, false, req.flash('loginMessage', 'Unknown user'));
                    } else if (!user.validPassword(password)) {
                        done(null, false, req.flash('loginMessage', 'Wrong password'));
                    } else {
                        done(null, user);
                    }
                })
                .catch(function (e) {
                    done(null, false, req.flash('loginMessage', e.name + " " + e.message));
                });
        }));

    passport.use('local-signup', new LocalStrategy({
        passReqToCallback: true
    },
        function (req, username, password, done) {
            findOrCreateUser = function () {
                User.findOne({ 'username': username }, function (err, user) {
                    if (err) {
                        console.log('Error in SignUp: ' + err);
                        return done(err);
                    }
                    if (user) {
                        console.log('User already exists');
                        return done(null, false,
                            req.flash('message', 'User Already Exists'));
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        newUser.email = req.param('email');
                        newUser.firstname = req.param('firstname');
                        newUser.lastname = req.param('lastname');
                        newUser.save(function (err) {
                            if (err) {
                                console.log('Error in Saving user: ' + err);
                                throw err;
                            }
                            console.log('User Registration succesful');
                            return done(null, newUser);
                        });
                    }
                });
            };
        }));
};
