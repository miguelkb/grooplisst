var express = require('express');
var router = express.Router();

var jwt = require('express-jwt');
var auth = jwt({
	secret: process.env.GROOPLISST_SECRET,
	userProperty: 'payload'
});

var ussers = require('./ussers');
var lissts = require('./lissts');

router.get('/', ussers.index);
router.get('/lissts/', auth, lissts.index);

module.exports = router