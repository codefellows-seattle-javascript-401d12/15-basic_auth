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

albumRouter.get('/api/album/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('GET: /api/album/:id');

  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));

  Album.findOne({ _id: req.params.id})
  .then( album => {
    if(!album) return next(createError(404, 'not found'));

    res.json(album);
  })
  .catch(next);
});

albumRouter.put('/api/album/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/album/:id');
  if(!req.params.id) return next(createError(400, 'bad request \n id required'));
  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));

  Album.findOne({ _id: req.params.id})
  .then( album => {
    if(!album) return next(createError(404, 'not a valid id'));
    for (var prop in req.body) {
      if( album[prop] ) {
        album[prop] = req.body[prop];
      }
      if( !album[prop]){
        return next(createError(400, 'not a valid body'));
      }
    }
    res.json(album);
  })
  .catch(next);
});

albumRouter.delete('/api/album/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('DELETE: /api/album');

  req.body.userID = req.user._id;

  if(!req.body.userID) return next(createError(400, 'bad request \n token required'));

  Album.findByIdAndRemove(req.params.id)
  .then( () => {
    var response = {
      id: req.body.id,
      message: 'album deleted successfully',
    };
    res.json(response);
  })
  .catch(next);
});
