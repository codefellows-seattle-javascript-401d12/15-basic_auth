'use strict';

const createError = require('http-errors');
const debug = require('debug')('photogram:basic auth middleware');

module.exports = function(request, response, next) {
  debug('Basic auth');

  var authHeader = request.headers.authorization;
  if (!authHeader) return next(createError(401, 'No authorization header provided.'));

  var base64str = authHeader.split('Basic ')[1];
  if (!base64str) return next(createError(401, 'Username/password combination not provided.'));

  var utf8str = new Buffer(base64str, 'base64').toString();
  var authArr = utf8str.split(':');

  request.auth = {
    username: authArr[0],
    password: authArr[1]
  };

  if (!request.auth.username) return next(createError(401, 'No username provided.'));
  if (!request.auth.password) return next(createError(401, 'No password provided.'));

  next();
};
