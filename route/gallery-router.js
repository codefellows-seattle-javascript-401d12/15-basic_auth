'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware');

const galleryRouter = module.exports = Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/gallery');

  req.body.userID = req.user._id;
  new Gallery(req.body).save()
  .then(gallery => res.json(gallery))
  .catch(next);
});

galleryRouter.get('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('GET: /api/gallery/:id');

  Gallery.findById(req.params.id)
  .then( gallery => {
    if ( gallery.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'invalid user'));
    };
    res.json(gallery);
  })
  .catch(next);
});

galleryRouter.get('/api/gallery', bearerAuth, function(req, res, next) {
  debug('GET: /api/gallery');

  Gallery.find({}, function(err, galleries){
    if(err) return next(err);
    res.json(galleries);
  });
});

galleryRouter.put('/api/gallery/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/gallery/:id');

  Gallery.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( gallery => res.json(gallery))
  .catch( err => {
    if(err) return next(createError(400, 'bad request'));
  });
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/gallery/:id');

  Gallery.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
