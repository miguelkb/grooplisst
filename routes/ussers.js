var express = require('express');
var router = express.Router();
var handler = require('../handler.js');

var passport = require('./passport');

var mongoose = require('mongoose');
var db = mongoose.createConnection(process.env.MONGODB_URI);
var UsserSchema = require('../models/Usser.js').UsserSchema;
var Usser = db.model('ussers', UsserSchema);


var router = {};

router.register = function(request, response) {
    var usser = new Usser();
    usser.name = request.body.name;
    usser.email = request.body.email;

    if (request.body.password) {
        usser.setPassword(request.body.password);
    }
    else {
        return handler.InternalServerError(response, request.i18n_texts.PASSWORD_REQUIRED);
    }

    usser.save(function(error) {
        var token = usser.generateJwt();
        return handler.Ok(response, { token : token });
    });
};

router.login = function(request, response) {
    passport.authenticate('local', function(error, usser, info){
        if (error) {
            return handler.NotFound(error);
        }

        if(usser){
            var token = usser.generateJwt();
            return handler.Ok(response, { token : token });
        }
        else {
            return handler.Unauthorized(response, info);
        }
    })(request, response);
};

router.profile = function(request, response){
	if (!request.payload._id) {
        return handler.Unauthorized(response, request.i18n_texts.PROFILE_IS_PRIVATE);
    } 
    else {
        Usser
            .findById(request.payload._id)
            .exec(function(error, usser) {
                if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_GETTING_PROFILE);
                if (!usser) return handler.NotFound(response, request.i18n_texts.PROFILE_NOT_FOUND);
                response.status(200).json(usser);
            });
    }
};

router.index = function(request, response){
    response.render('login', { title: 'Lissts' });
};

module.exports = router;