'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

require('../server.js');

const PORT = process.env.PORT;
const url = `http://localhost:${PORT}`;

mongoose.promise = Promise;

const exampleUser = {
  username: 'test user',
  password: 'testpassword',
  email: 'test_user@test.com'
};

describe('Authorization Routes', function() {
  describe('POST: /api/signup', function() {
    describe('Valid Body', function() {
      after( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
          .send(exampleUser)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
    describe('Invalid Body', function() {
      after( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should respond with a status of 400', done => {
        request.post(`${url}/api/signup`)
          .send({})
          .end((res) => {
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('Valid Body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.genPasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            done();
          })
          .catch( err => {
            return done(err);
          });
      });
      after( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
          .auth('test user', 'testpassword')
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
    describe('Invalid Body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.genPasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            done();
          })
          .catch(done);
      });
      after( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should return an error for invalid password', done => {
        request.get(`${url}/api/signin`)
          .auth('test user', 'incorrecttestpassword')
          .end((res) => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
  });
});
