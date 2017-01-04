'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('picgram:photobook-router');

const Photobook = require('../model/photobook.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const photobookRouter = module.exports = Router();

photobookRouter.post('/api/photobook', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/photobook');

  req.body.userID = req.user._id;
  new Photobook(req.body).save()
  .then( photobook => res.json(photobook))
  .catch(next);
});

photobookRouter.get('/api/photobook/:id', bearerAuth, function(req, res, next) {
  debug('GET: /api/photobook/:id');

  Photobook.findById(req.params.id)
  .then( photobook => {
    if (photobook.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'invalid user'));
    }
    res.json(photobook);
  })
  .catch(err => next(createError(404, err.message)));
});

photobookRouter.delete('/api/photobook/:id', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/photobook/:id');

  Photobook.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).send('deleted photobook'))
  .catch(err => next(createError(404, err.message)));
});

photobookRouter.put('/api/photobook/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/photobook/:id');

  Photobook.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( photobook => res.json(photobook))
  .catch(err => next(createError(404, err.message)));
});
