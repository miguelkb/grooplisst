/*
'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'groopLisst@gmail.com',
        pass: 'Gr00pLi$$t'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: '"GroopLisst" <groopLisst@gmail.com>', // sender address
    to: 'miguelkoo88@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
*/


var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var socket_io = require('socket.io');
var i18n = require("i18n-express");

var webRoutes = require('./routes/web.routes');
var apiRoutes = require('./routes/api.routes');
var passport = require('./routes/passport');


var app = express();

var io = socket_io();
app.io = io;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/scripts', express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(i18n({ 
    defaultLang: 'en', 
    translationsPath: path.join(__dirname, 'i18n'),
    siteLangs: [ "en", "es" ],
    textsVarName: 'translation' 
}));


app.use('/', webRoutes);
app.use('/api/', apiRoutes);

app.use(passport.initialize());

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {

    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"message" : err.name + ": " + err.message});
    }
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ error: true, message: err.message });
});


io.on("connection", apiRoutes.lisstSocket);

module.exports = app;
