var express = require('express');
var router = express.Router();
var handler = require('../handler.js');

var mongoose = require('mongoose');
var db = mongoose.createConnection(process.env.MONGODB_URI);
var LisstSchema = require('../models/Lisst.js').LisstSchema;
var Lisst = db.model('lissts', LisstSchema);


router.index = function(request, response){
    response.render('lissts', { title: 'Lissts' });
};

router.getLissts = function(request, response) {
    var usserId = request.payload._id;
    Lisst.find({ usserId: usserId }, function(error, lissts) {
        return handler.Ok(response, lissts);
    });
};

router.getLisstByID = function(request, response) {  
    var usserId = request.payload._id;
    var lisstId = request.params.id;
    Lisst.findById(lisstId, '', { lean: true }, function(error, lisst) {
        if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_GETTING_LISST);
        if (!lisst) return handler.NotFound(response, request.i18n_texts.LISST_NOT_FOUND);
        if (lisst.usserId != usserId) return handler.Unauthorized(response);

        return handler.Ok(response, lisst);
    });
};

router.createLisst = function(request, response) {
    var usserId = request.payload._id;
    var tmpLisst = request.body;

    tmpLisst.usserId = usserId;
    var lisst = new Lisst(tmpLisst);
    lisst.save(function(error, lisst) {
        if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_SAVING_LISST);
        if (!lisst) return handler.NotFound(response, request.i18n_texts.LISST_NOT_FOUND);
        
        return handler.Ok(response, lisst);
    });
};

router.updateLisst = function(request, response) {
    var usserId = request.payload._id;
    var lisstId = request.params.id;
    
    Lisst.findById(lisstId, '', { lean: true }, function (error, lisst) {
        if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_UPDATING_LISST);
        if (!lisst) return handler.NotFound(response, request.i18n_texts.LISST_NOT_FOUND);
        if (lisst.usserId != usserId ) return handler.Unauthorized(response);

        Lisst.update({ _id: lisstId }, request.body, function(error, rowsAffected) {
            if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_UPDATING_LISST);
            if (!rowsAffected) return handler.NotFound(response, request.i18n_texts.LISST_NOT_FOUND);

            return handler.Ok(response, request.body);
        });

    });
};

router.deleteLisst = function(request, response) {
    var usserId = request.payload._id;
    var lisstId = request.params.id;

    Lisst.findById(lisstId, '', { lean: true }, function (error, lisst) {
        if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_DELETING_LISST);
        if (!lisst) return handler.NotFound(response, request.i18n_texts.LISST_NOT_FOUND);
        if (lisst.usserId != usserId ) return handler.Unauthorized(response);

        Lisst.remove({ _id: lisstId }, function(error, lisst) {
            if (error) return handler.InternalServerError(response, request.i18n_texts.ERROR_DELETING_LISST);
            if (!lisst) return handler.NotFound(response, request.i18n_texts.LISST_NOT_FOUND);
        
            return handler.Ok(response, { error: false, message: request.i18n_texts.LISST_DELETED });
        });
    });
};

router.lisstSocket = function(socket) {
    socket.on('update:lisst', function(lisst) {
        Lisst.findOneAndUpdate({ _id: lisst._id}, lisst, function (error, lisst) {
            if (error || !lisst) return;
            
            socket.broadcast.emit('lisst:updated', lisst);   
        });
    });
};

module.exports = router;