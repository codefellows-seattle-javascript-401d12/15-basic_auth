'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const serverToggle = require('./lib/server-toggle.js');
const User = require('../model/user.js');

mongoose.Promise = Promise;

const server = require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234yes',
  email: 'exampleuser@test.com'
};

describe('Auth Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token and a 200 status', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });

      describe('has an invalid POST request', function() {
        it('should return a 400 status', done => {
          request.post(`${url}/api/signup`)
          .send({username: 'username', password: 'password'})
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err).to.be.an('error');
            done();
          });
        });
      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      before( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
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

      it('should return a token and a 200 status', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', '1234yes')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });

      describe('has an invalid GET request', () => {
        it('should return 401 status code for non-authenticated users', (done) => {
          request.get(`${url}/api/signin`)
          .auth('exampleuser', 'invalidpassword')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(err).to.be.an('error');
            done();
          });
        });
      });

      describe('testing a non-existent route', function() {
        it('should return a 404 not found status', done => {
          request.get(`${url}/api/nonexistent`)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(err).to.be.an('error');
            done();
          });
        });
      });
    });
  });
});
