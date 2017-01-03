'use strict';

const Router = require('express').Router;
const debug = require('debug')('photogram:auth routes');
const parseJSON = require('body-parser').json();
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const authRouter = module.exports = Router();

authRouter.post('/api/createuser', parseJSON, function(request, response, next) {
  debug('POST: /api/createuser');

  if (Object.keys(request.body).length < 1) {
    response.status(400).send('No user parameters provided.');
    return;
  }

  let user = new User(request.body);

  let password =  request.body.password;
  delete request.body.password;

  user.createHash(password)
  .then(user => user.save())
  .then(user => user.createToken())
  .then(token => response.send(token))
  .catch(next);
});

authRouter.get('/api/signin', basicAuth, function(request, response, next) {
  debug('GET: /api/signin');

  User.findOne({username: request.auth.username})
  .then(user => user.checkPassword(request.auth.password))
  .then(user => user.createToken())
  .then(token => response.send(token))
  .catch(next);
});
