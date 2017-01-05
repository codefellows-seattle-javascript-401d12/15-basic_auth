'use strict';

const Debug = require('debug')('kauth:router');
const jsonParser = require('body-parser').json();
const Express = require('express');

const User = require('../model/user.js');
const authMiddlewareBasic = require('../lib/basic-auth-middleware');

const kauthRouter = module.exports = Express.Router();

kauthRouter.post('/api/signup', jsonParser, (req, res, next) => {
  Debug('POST: api/signup');

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
  .catch(next);
});

kauthRouter.get('/api/signin', authMiddlewareBasic, (req, res, next) => {
  Debug('GET: api/signin');

  User.findOne({username: req.auth.username})
  .then( foundUser => foundUser.comparePasswordHash(req.auth.password))
  .then( correctPasswordUser => correctPasswordUser.generateToken())
  .then( newToken => res.send(newToken))
  .catch(next);
});
