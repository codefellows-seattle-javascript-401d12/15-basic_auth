'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('cfgram:vault-router');

const Vault = require('../model/vault.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const vaultRouter = module.exports = Router();

vaultRouter.post('/api/vault', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/vault');

  req.body.userID = req.user._id;
  new Vault(req.body).save()
  .then( vault => res.json(vault))
  .catch(next);
});

vaultRouter.get('/api/vault/:id', bearerAuth, function(req, res, next) {
  debug('GET: /api/vault/:id');

  Vault.findById(req.params.id)
  .then( vault => {
    if (vault.userID.toString() !== req.user._id.toString()) {
      return next(createError(401, 'invalid user'));
    }
    res.json(vault);
  })
  .catch(next);
});

vaultRouter.put('/api/vault/:id', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/vault/:id');

  Vault.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then( vault => res.json(vault))
  .catch( err => next(createError(404, err.message)));
});

vaultRouter.delete('/api/vault/:id', function(req, res, next) {
  debug('DELETE: /api/vault/:id');

  Vault.findByIdAndRemove(req.params.id)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.messgae)));
});
