'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('lab15:blog-router');

const Blog = require('../model/blog.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const blogRouter = module.exports = Router();

blogRouter.post('/api/blog', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/blog');

  req.body.memberID = req.member._id;
  new Blog(req.body).save()
  .then( blog => res.json(blog))
  .catch(next);
});

blogRouter.get('/api/blog/:id', bearerAuth,  function(req, res, next) {
  debug('GET: /api/blog/:id');

  if(req.params.id === null || req.params.id === undefined) {
    return createError(400, 'Bad request');
  }
  Blog.findById(req.params.id)
  .then( blog => {
    if(blog.memberID.toString() !== req.member._id.toString()) {
      return next(createError(401, 'Invalid member'));
    }
    res.json(blog);
  })
  .catch(next);
});

blogRouter.put('/api/blog/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/blog/:id');

  Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
  .then( blog => {
    if(blog.memberID.toString() !== req.member._id.toString()) {
      return next(createError(401, 'Invalid member'));
    }
    res.json(blog);
  })
  .catch(next);
});

blogRouter.delete('/api/blog/:id', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/blog/:id');

  Blog.findByIdAndRemove(req.params.id)
  .then( () => {
    res.status(204).send();
  })
  .catch(next);
});
