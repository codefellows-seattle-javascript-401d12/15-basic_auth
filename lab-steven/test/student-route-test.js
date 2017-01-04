'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../model/user.js');
const Student = require('../model/student.js');
const url = `http://localhost:${process.env.PORT}`;

require('../server.js');

const sampleUser = {
  username: 'Test user',
  email: 'Test@test.com',
  password: 'Testword'
};

const sampleStudent = {
  name: 'Test student',
  age: 99
};

describe('Student routes', function() {
  beforeEach(done => {
    new User(sampleUser)
    .createHash(sampleUser.password)
    .then(user => {
      this.tempUser = user;
      return user.createToken();
    })
    .then(token => {
      this.tempToken = token;
      done();
    })
    .catch(done);
  });
});
