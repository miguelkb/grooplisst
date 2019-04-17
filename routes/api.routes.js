var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.GROOPLISST_SECRET,
	userProperty: 'payload'
});

var ussers = require('./ussers');
var lissts = require('./lissts');

router.post('/ussers/register', ussers.register);
router.post('/ussers/login', ussers.login);
router.get('/ussers/profile', auth, ussers.profile);

router.get('/lissts', auth, lissts.getLissts);
router.get('/lissts/:id', auth, lissts.getLisstByID);
router.post('/lissts', auth, lissts.createLisst);
router.put('/lissts/:id', auth, lissts.updateLisst);
router.delete('/lissts/:id', auth, lissts.deleteLisst);
router.lisstSocket = lissts.lisstSocket;

module.exports = router
