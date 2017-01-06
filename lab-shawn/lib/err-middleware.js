'use strict';

const createError = require('http-errors');
const debug = require('debug')('library:err-middleware');

module.exports = function(err,req,res,next){
  debug('err-middleware');

  console.error(err.name);
  console.error(err.message);
  if(err.status){
    res.status(err.status).send(err.name);
    next();
    return;
  }
  if(err.name === 'ValidationError'){
    err = createError(400,err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  if(err.name === 'NotFoundError'){
    err = createError(404,err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }

  err = createError(500,err.message);
  res.status(err.status).send(err.name);
  next();
};
