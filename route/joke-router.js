'use strict';

const Express = require('express');
const jsonParser = require('body-parser').json();
const HttpError = require('http-errors');
const Debug = require('debug')('kauth:joke-router');

const Joke = require('../model/joke.js');
const BearerAuthMiddleware = require('../lib/bearer-auth-middleware.js');

const jokeRouter = module.exports = Express.Router();

jokeRouter.post('/api/joke', BearerAuthMiddleware, jsonParser, (req, res, next) => {
  Debug('POST: /api/joke');

  req.body.user_id = req.user._id;

  new Joke(req.body).save()
  .then( newJoke => {
    res.json(newJoke);
  })
  .catch( () => next(HttpError(400, 'unable to create joke. you are not funny')));

});

jokeRouter.get('/api/joke/:id', BearerAuthMiddleware, (req, res, next) => {
  Debug('GET: /api/joke/:id');

  Joke.findById(req.params.id)
  .then( foundJoke => {
    if(foundJoke.user_id.toString() !== req.user._id.toString()) return next(HttpError(401, 'Joke owner mismatch'));
    res.json(foundJoke);
  })
  .catch( () => next(HttpError(404, 'joke not found!')));

});

jokeRouter.put('/api/joke/:id', BearerAuthMiddleware, jsonParser, (req, res, next) => {
  Debug('PUT: /api/joke/:id');

  let changed = false;

  Joke.findById(req.params.id)
  .then( foundJoke => {
    for (var prop in req.body) {
      if (typeof req.body[prop] === typeof foundJoke[prop]) {
        foundJoke[prop] = req.body[prop];
        changed = true;
      }
    }
    foundJoke.save();
    changed ? res.send(foundJoke) : next(HttpError(204, 'nothing was updated!'));
  })
  .catch( () => next(HttpError(400, 'unable to modify joke. dont quit your day job')));

});

jokeRouter.delete('/api/joke/:id', BearerAuthMiddleware, (req, res, next) => {
  Debug('DELETE: /api/joke/:id');

  Joke.findById(req.params.id)
  .then( foundJoke => {
    console.log('DELETING*****************');
    if(foundJoke.user_id.toString() !== req.user._id.toString()) return Error;
    Joke.remove({_id: foundJoke._id});
    res.send('deleted!');
  })
  .catch( err => next(HttpError(400, 'unable to delete joke. youre no Jerry Seinfeld!  ' + err.message)));
});
