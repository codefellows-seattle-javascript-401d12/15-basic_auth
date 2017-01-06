'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('lab15:bearer-auth-middleware');

const Member = require('../model/member.js');

module.exports = function(req, res, next) {
  debug('bearer');

  var authHeader = req.headers.authorization;
  if(!authHeader) {
    return next(createError(401, 'authorization header is required'));
  }

  var token = authHeader.split('Bearer ')[1];
  if(!token) {
    return next(createError(401, 'token required'));
  }

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if(err) return next(err);

    Member.findOne({ findHash: decoded.token})
    .then( member => {
      req.member = member;
      next();
    })
    .catch(err => {
      next(createError(401, err.message));
    });
  });
};
