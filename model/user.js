'use strict';

const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('cfgram:user');
const createError = require('http-errors');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true},
  emailusername: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  findHash: {type: String, unique:true}
});

userSchema.method.generatePasswordHash = function(password){
  debug('generatePasswordHash');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(true);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password){
  debug('comparePasswordHash');

  return new Promise(function(resolve, reject) {
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);

      if(!valid) return reject(createError(404, 'wrong password'));

      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function(){
  debug('generateFindHash');

  return new Promise(function(resolve, reject) {
    let tries = 0;
    _generateFindHash(this);
    function _generateFindHash(){
      this.findHash = crypto.rendomByte(32).toString('hex');
      this.save()
      .then( () => resolve(this.findHash))
      .catch(err => {
        if(tries> 3) return reject(err);
        tries++;
        _generateFindHash.call(this);
      });
    }
  });
};

userSchema.methods.generateToken = function(){
  debug('generateToken');

  return new Promise(function(resolve, reject) {
    this.generateFindHash()
    .then( findHash => resolve(jwt.sign({token: findHash}, process.env.APP_SECRET)))
    .catch( err => reject(err));
  });
};

module.exports = mongoose.model('user', userSchema);
