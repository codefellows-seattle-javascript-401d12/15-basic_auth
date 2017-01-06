'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:gallery-router');

const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const galleryRouter = module.exports = Router();

galleryRouter.post('/api/gallery', bearerAuth, jsonParser, function(req,res,next){
  debug('POST: /api/gallery');

  req.body.userID = req.user._id;
  new Gallery(req.body).save()
  .then(gallery => {
    if(!req.body.name) return next(createError(400, 'body required'));
    res.json(gallery);
  })
  .catch(next);
});

galleryRouter.get('/api/gallery/:id', bearerAuth, function(req,res,next){
  debug('GET: /api/gallery/:id');


  Gallery.findById(req.params.id)
  .then(gallery => {
    if(gallery === null) return next(createError(404,'not found'));
    if(gallery.userID.toString() !== req.user._id.toString()){
      return next(createError(401,'invalid user'));
    }
    res.json(gallery);
  })
  .catch(next);
});

galleryRouter.put('/api/gallery/:id', bearerAuth, jsonParser, function(req,res,next){
  debug('PUT: /api/gallery/:id');

  if(req.body.name === undefined) return next(createError(400,'bad request'));

  Gallery.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(gallery => {
    // if(gallery.userID.toString() !== req.body._id.toString()){
    //   return  next(createError(401,'invalid user'));
    // }
    if(gallery === null) return next(createError(404,'not found'));
    res.json(gallery);
  })
  .catch(err => next(createError(404,err.message)));
});

galleryRouter.delete('/api/gallery/:id', bearerAuth, function(req,res,next){
  debug('DELETE: /api/gallery/:id');

  Gallery.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch(err => next(createError(404, err.message)));
});
