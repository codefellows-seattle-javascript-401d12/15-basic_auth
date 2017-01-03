'use strict';

const httpError = require('http-errors');
const debug = require('debug')('kauth-errormiddleware');

module.exports = function(err, req, res, next) { //eslint-disable-line
  debug('error middleware');

  console.error('msg:', err.message, 'name:', err.name);

  if(err.status) {
    console.error('user error:', err.status);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'ValidationError') {
    err = httpError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = httpError(500, err.message);
  res.status(err.status).send(err.message);
  next();
};
