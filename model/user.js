'use strict';

const debug = require('debug')('fomogram:user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  findHash: { type: String, unique: true }
});

userSchema.methods.genPasswordHash = function(password) {
  debug('genPasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(!password) return reject(createError(400, 'provide a password'));
      if(err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(createError(401, 'incorrect password'));
      resolve(this);
    });
  });
};

userSchema.methods.genfindHash = function() {
  debug('genfindHash');

  return new Promise((resolve, reject) => {
    let attempts = 0;

    _genfindHash.call(this);

    function _genfindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then( () => resolve(this.findHash))
        .catch( err => {
          if(attempts > 3) return reject(err);
          attempts++;
          _genfindHash.call(this);
        });
    }
  });
};

userSchema.methods.genToken = function() {
  debug('genToken');

  return new Promise((resolve, reject) => {
    this.genfindHash()
      .then( findHash => resolve(jwt.sign({ token: findHash }, process.env.SECRET)))
      .catch( err => reject(err));
  });
};

module.exports = mongoose.model('user', userSchema);
