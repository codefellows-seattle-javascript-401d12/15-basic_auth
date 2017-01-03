'use strict';

const createError = require('http-errors');
const debug = require('debug')('cfgram:basic-auth-middleware');

module.exports = function(req, res, next) {
  debug('authentication');

  var authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'requires an authorization header'));
  }

  var base64str = authHeader.split('Basic ')[1];
  if (!base64str) {
    return next(createError(401, 'username and password is required'));
  }

  var utf8str = new Buffer(base64str, 'base64').toString();
  var authArr = utf8str.split(':');

  req.auth = {
    username: authArr[0],
    password: authArr[1]
  };

  if (!req.auth.username) {
    return next(createError(401, 'username is required'));
  }

  if (!req.auth.password) {
    return next(createError(401, 'password is required'));
  }

  next();
};
