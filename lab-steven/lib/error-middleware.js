'use strict';

const createError = require('http-errors');
const debug = require('debug')('photogram:error middleware');

module.exports = function(err, request, response, next) {
  debug('Error middleware');

  if (err.status) {
    response.status(err.status).send(err.message);
    next();
    return;
  }

  err = createError(500, 'General server error.');
  response.status(err.status).send(err.message);
  next();
};
