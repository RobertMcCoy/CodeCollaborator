var bCrypt = require('bcrypt-nodejs');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, user) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            if (user) {
                done(null, user.get());
            }
            else {
                done(user.errors, null);
            }
        });

    });

    passport.use('local-signup', new LocalStrategy(
        {
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };
            User.findOne({ where: { username: username } }).then(function (user) {
                if (user) {
                    return done(null, false, { message: 'That username is already taken' });
                }
                else {
                    var userPassword = generateHash(password);
                    var data =
                        {
                            username: username,
                            password: userPassword,
                            email: req.body.email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname
                        };
                    User.create(data).then(function (newUser, created) {
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            newUser.save();
                            return done(null, newUser);
                        }
                    });
                }
            });
        }
    ));

    //LOCAL SIGNIN
    passport.use('local-signin', new LocalStrategy(
        {
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var User = user;
            var isValidPassword = function (userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({ where: { username: username } }).then(function (user) {
                if (!user) {
                    return done(null, false, { message: 'Username does not exist' });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                var userinfo = user.get();
                return done(null, userinfo);
            }).catch(function (err) {
                console.log("Error:", err);
                return done(null, false, { message: 'Something went wrong with your Signin' });
            });
        }
    ));
}
