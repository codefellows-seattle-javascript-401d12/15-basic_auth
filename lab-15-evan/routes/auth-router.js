'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('lab15:auth-router');
const Router = require('express').Router;
const basicAuth = require('../lib/auth-middleware.js');

const Member = require('../model/member.js');

const authRouter = module.exports = Router();

authRouter.post('/api/createAccount', jsonParser, function(req, res, next) {
  debug('POST: /api/createAccount');

  let password = req.body.password;
  delete req.body.password;

  let member = new Member(req.body);

  member.generatePasswordHash(password)
  .then( () => member.save())
  .then( () => member.generateToken())
  .then( token => res.send(token))
  .catch(next);
});

authRouter.get('/api/login', basicAuth, function(req, res, next) {
  debug('GET: /api/login');

  Member.findOne({ username: req.auth.username })
  .then( member => member.comparePasswordHash(req.auth.password))
  .then( member => member.generateToken())
  .then( token => res.send(token))
  .catch(next);
});
