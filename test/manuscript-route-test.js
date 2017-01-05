'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Manuscript = require('../model/manuscript.js');
const User = require('../model/user.js');
const Publisher = require('../model/publisher.js');

mongoose.Promise = Promise;

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

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

const testManuscript = {
  name: 'test txt file',
  desc: 'test file description',
  doc: `${__dirname}/data/tester.txt`
};
