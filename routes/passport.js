var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var db = mongoose.createConnection(process.env.MONGODB_URI);
var UsserSchema = require('../models/Usser.js').UsserSchema;
var Usser = db.model('ussers', UsserSchema);


passport.use(
    new LocalStrategy({
        usernameField: 'email'
    },
    function(username, password, done) {

        Usser.findOne({ email: username }, function (err, usser) {

            if (err) { return done(err); }
            if (!usser) {
                return done(null, false, {
                    message: 'User not found'
                });
            }
            if (!usser.validPassword(password)) {
                return done(null, false, {
                    message: 'Password is wrong'
                });
            }
            return done(null, usser);
        });
    })
);

module.exports = passport;
