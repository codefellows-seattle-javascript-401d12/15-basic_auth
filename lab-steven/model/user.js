'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('photogram:user schema');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});

module.exports = mongoose.model('user', userSchema);

userSchema.methods.createHash = function(password) {
  debug('createHash');

  bcrypt.hash(password, 8)
  .then(hash => {
    this.password = hash;
    return Promise.resolve(this);
  })
  .catch(err => Promise.reject(err));
};

userSchema.methods.checkPassword = function(password) {
  debug('checkPassword');

  bcrypt.compare(password, this.password)
  .then(() => Promise.resolve(this))
  .catch(() => Promise.reject(createError(401, 'Wrong password')));
};
