'use strict';

const Router = require('express').Router;
const debug = require('debug')('photogram:auth routes');
const createError = require('http-errors');
const parseJSON = require('body-parser').json();
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const authRouter = module.exports = Router();

authRouter.post('/api/createuser', parseJSON, function(request, response, next) {
  debug('POST: /api/createuser');

  let user = new User(request.body);

  let password =  request.body.password;
  delete request.body.password;

  user.createHash(password)
  .then(user => user.save())
  .then(user => user.createToken())
  .then(token => response.send(token))
  .catch(next);
});
