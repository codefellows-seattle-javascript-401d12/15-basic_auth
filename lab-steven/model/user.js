'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('photogram:user schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});

userSchema.methods.createHash = function(password) {
  debug('createHash');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 8)
    .then(hash => {
      this.password = hash;
      return resolve(this);
    })
    .catch(err => reject(err));
  });
};

userSchema.methods.checkPassword = function(password) {
  debug('checkPassword');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password)
    .then(() => resolve(this))
    .catch(() => reject(createError(401, 'Wrong password')));
  });
};

userSchema.methods.generateFindHash = function() {
  debug('generateFindHash');

  let tries = 0;

  return new Promise((resolve, reject) => {
    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(25).toString();
      this.save()
      .then(() => resolve(this.findHash))
      .catch(() => {
        if (tries > 3) return reject(createError(500, 'Exceeded number of tries to find hash.'));
        tries++;
        _generateFindHash.call(this);
      });
    }
  });
};

userSchema.methods.createToken = function() {
  debug('createToken');

  this.generateFindHash()
  .then(foundHash => Promise.resolve(jwt.sign({token: foundHash}, process.env.APP_SECRET)))
  .catch(err => Promise.reject(err));
};

module.exports = mongoose.model('user', userSchema);
