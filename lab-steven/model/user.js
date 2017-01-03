'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('photogram:user schema');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  findHash: {type: String, unique: true}
});

module.exports = mongoose.model('user', userSchema);
