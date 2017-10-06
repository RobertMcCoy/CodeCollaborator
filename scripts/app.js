var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var helmet = require('helmet');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('../routes/index');
const passport = require('passport');
require('../server/config/passport')(passport);

var models = require("../server/models");
models.sequelize.sync();

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

app.set('views', path.join(__dirname, '/../views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(require('connect-flash'));

app.use(session({ secret: (process.env.EXPRESS_SESSION_SECRET || "secret"), saveUninitialized: false, resave: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "/../build")));

app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;