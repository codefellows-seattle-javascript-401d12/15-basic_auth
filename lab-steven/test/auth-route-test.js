'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const User = require('../model/user.js');
const url = `http://localhost:${process.env.PORT}`;

require('../server.js');

const sampleUser = {
  username: 'Test user',
  email: 'test@test.com',
  password: 'Testword'
};

describe('Auth routes', function() {
  describe('POST: /api/createuser', function() {
    describe('With a valid body', function() {
      after(done => {
        User.remove({})
        .then(() => done())
        .catch(done);
      });

      it('should return a token', done => {
        request
        .post(`${url}/api/createuser`)
        .send(sampleUser)
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.text).to.be.a('string');
          done();
        });
      });
    });

    describe('With an invalid body', function() {
      it('should return a 401 error', done => {
        request
        .post(`${url}/api/createuser`)
        .send({username: 'Steve'})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(401);
          done();
        });
      });
    });
  });
});
