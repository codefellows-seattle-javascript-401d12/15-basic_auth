'use strict';

const debug = require('debug')('kauth:router');
const jsonParser = require('body-parser').json();
const ExpressRouter = require('express').Router;
const User = require('../model/user.js');
const authMiddleware = require('../lib/basic-auth-middleware');

const kauthRouter = module.exports = ExpressRouter();

kauthRouter.post('/api/signup', jsonParser, (req, res, next) => {
  debug('POST: api/signup');

  try {
    var newUser = new User(req.body);
  }
  catch(err) {
    err.status = 400;
    err.name = 'bad request';
    next(err);
  }

  newUser.hashPassword(req.body.password)
  .then( user => user.save())
  .then( user => user.generateToken())
  .then( token => res.send(token))
  .catch( err => {
    if (err) {
      err.status = 400;
      err.name = 'bad password';
      next(err);
    }
  });
});

kauthRouter.get('/api/signin', authMiddleware, (req, res, next) => {
  debug('GET: api/signin');

  User.findOne({username: req.auth.username})
  .then( foundUser => foundUser.comparePasswordHash(req.auth.password))
  .then( correctPasswordUser => correctPasswordUser.generateToken())
  .then( newToken => res.send(newToken))
  .catch(next);
});
