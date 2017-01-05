'use strict';

const debug = require('debug')('fomogram:auth-router');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const basicAuth = require('../lib/auth-middleware.js');
const User = require('../model/user.js');
const authRouter = module.exports = Router();

authRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);

  user.genPasswordHash(password)
    .then( () => user.save( err => console.log(err)))
    .then( () => user.genToken())
    .then( token => res.send(token))
    .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');

  User.findOne({ username: req.auth.username })
    .then( user => user.comparePasswordHash(req.auth.password))
    .then( user => user.genToken())
    .then( token => res.send(token))
    .catch(next);
});
