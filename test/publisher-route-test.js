'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Publisher = require('../model/publisher.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'testuser',
  password: '55555',
  email: 'testuser@test.com'
};

const testPublisher = {
  name: 'test publisher',
  desc: 'test publisher description'
};
