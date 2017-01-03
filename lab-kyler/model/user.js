'use strict';
const Mongoose = require('mongoose');
const debug = require('debug')('kauth:userModel');
const bcrypt = require('bcrypt');
const Promise = require('bluebird');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

var userSchema = new Mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  findHash: {type: String, unique: true}
});

userSchema.methods.hashPassword = function(rawPassword) {
  debug('hashPassword');

  return new Promise( (resolve, reject) => {
    bcrypt.hash(rawPassword, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash; //hashed version of this password
      resolve(this);
    });
  });
};

userSchema.methods.generateToken = function() {
  debug('generateToken');

  return new Promise( (resolve, reject) => {
    this.generateFindHash()
    .then( findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};

userSchema.methods.generateFindHash = function() {
  debug('generateFindHash');

  return new Promise( (resolve, reject) => {
    let tries = 0;

    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch( err => {
        if (tries > 3) return reject(err);
        tries++;
        _generateFindHash().call(this);
      });
    }
  });
};

userSchema.methods.comparePasswordHash = function(password) {
  debug('comparePasswordHash');

  return new Promise( (resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'wrong passwerd'));
      resolve(this);
    });
  });
};

module.exports = Mongoose.model('user', userSchema);
