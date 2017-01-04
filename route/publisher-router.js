'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:publisher-router');

const Publisher = require('../model/publisher.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const publisherRouter = module.exports = Router();

publisherRouter.post('/api/publisher', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/publisher');

  req.body.userID = req.user._id;
  new Publisher(req.body).save()
  .then(publisher => res.json(publisher))
  .catch(next);
});

publisherRouter.get('/api/publisher/:id', bearerAuth, function(req, res, next) {
  debug('GET: /api/publisher/:id');

  Publisher.findById(req.params.id)
  .then(publisher => {
    if (publisher.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'invalid user'));
    }
    res.json(publisher);
  })
  .catch(next);
});
