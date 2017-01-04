'use strict';

const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const debug = require('debug')('photogram:bearer auth middleware');
const User = require('../model/user.js');

module.exports = function(request, response, next) {
  debug('Bearer auth middleware');

  var authHeader = request.headers.authorization;
  if (!authHeader) return next(createError(401, 'No header provided.'));

  var token = authHeader.split('Bearer ')[1];
  if (!token) return next(createError(401, 'No token provided.'));

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(createError(500, 'Token not verified correctly'));

    User.findOne({findHash: decoded.token})
    .then(user => {
      request.user = user;
      next();
    })
    .catch(err => next(createError(401, err.message)));
  });
};
