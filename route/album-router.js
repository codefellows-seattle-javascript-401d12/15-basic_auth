'use strict';

const debug = require('debug')('cfgram:album-router');
const createError = require('http-errors');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;


const bearerAuth = require('../lib/bearer-auth-middleware.js');
const Album = require('../model/album.js');

const albumRouter = module.exports = Router();

albumRouter.post('/api/album', bearerAuth, jsonParser, function(req, res, next){
  debug('POST: /api/album');

  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));


  new Album(req.body).save()
  .then( album => res.json(album))
  .catch(next);
});

albumRouter.get('/api/album', bearerAuth, jsonParser, function(req, res, next){
  debug('GET: /api/album');

  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));

  Album.findOne({ _id: req.body.id})
  .then( album => {
    if(!album) return next(createError(404, 'not found'));

    res.json(album);
  })
  .catch(next);
});

albumRouter.put('/api/album', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/album');

  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));

  Album.findOne({ _id: req.body.id})
  .then( album => {
    for(var prop in album){
      if(req.body[prop]) album[prop] = req.body[prop];
    }
    res.json(album);
  })
  .catch(next);
});

albumRouter.delete('/api/album', bearerAuth, jsonParser, function(req, res, next){
  debug('DELETE: /api/album');

  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));

  Album.findByIdAndRemove(req.body.id)
  .then( () => {
    var response = {
      id: req.body.id,
      message: 'album deleted successfully',
    };
    res.json(response);
  })
  .catch(next);
});
