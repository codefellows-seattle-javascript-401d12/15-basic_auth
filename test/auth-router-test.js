'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

mongoose.Promise = Promise;

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleUser',
  password: '1234',
  email: 'exampleuser@example.com'
};

describe('Auth Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST:/api/signup', function() {
    describe('with a valid body', function() {
      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end((err, res) => {
          if (err) return done(err);
          // console.log('\ntoken: ', res.text, '\n');
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });

      describe('no request body, or invalid body', function() {
        it('should throw a 400 error', done => {
          request.post(`${url}/api/signup`)
          .send({username: 'username', password: 'password'})
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(err).to.be.an('error');
            done();
          });
        });
      });

      describe('with a bad route', () => {
        it('should return a 404 error', done => {
          request.post(`${url}/api/`)
          .send(exampleUser)
          .end(res => {
            expect(res.status).to.equal(404);
            done();
          });
        });
      });
    });
  });
  describe('GET: /api/signin', function() {
    before(done => {
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

    describe('with a valid body', () => {
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleUser', '1234')
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
    describe('with authentication failure', function() {
      it('should return a 401 error', done => {
        request.get(`${url}/api/signin`)
        .auth('testuser', 'bad1234')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.be.an('error');
          done();
        });
      });
    });
    describe('with a bad route', function() {
      it('should return a 404 error', done => {
        request.get(`${url}/api/`)
        .auth('testuser', 'bad1234')
        .end(res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
