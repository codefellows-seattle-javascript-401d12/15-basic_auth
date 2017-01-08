'use strict';

const JsonWebToken = require('jsonwebtoken');
const HttpErrors = require('http-errors');
const Debug = require('debug')('kauth:bearer-auth-middleware');

const User = require('../model/user.js');

module.exports = function (req, res, next) {
  Debug('bearer-auth-middleware');
  if (!req.headers.authorization) return next(HttpErrors(401, 'No auth header receievd'));

  JsonWebToken.verify(req.headers.authorization.split('Bearer ')[1], process.env.APP_SECRET, (err, verifyResult) => {
    if(err) return next(HttpErrors(401, 'unable to parse token'));

    User.findOne({ findHash: verifyResult.token })
    .then( user => {
      req.user = user;
      next();
    })
    .catch( err => next(HttpErrors(401, `unable to find user associated with that token, error: ${err.message}`)));
  });

};
