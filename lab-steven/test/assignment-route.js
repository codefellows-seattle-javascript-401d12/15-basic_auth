'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Student = require('../model/student.js');
const Assignment = require('../model/assignment.js');
const server = require('../server.js');
const serverSwitch = require('./lib/server-switch.js');
const url = `http://localhost:${process.env.PORT}`;

const sampleUser = {
  username: 'Test user',
  email: 'test@test.com',
  password: 'Testword'
};

const sampleStudent = {
  name: 'Test student',
  age: 30
};

const sampleAssignment = {
  name: 'Test assignment',
  details: 'Test details',
  text: `${__dirname}/data/test.txt`
};
