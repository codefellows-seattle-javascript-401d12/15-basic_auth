'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser ={
  username: 'exampleUser',
  password: '1234',
  email: 'exampleUser@test.com'
};

describe('Auth Routes', function() {
  describe('POST: /api/signup', function() {
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
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('invalid POST route', function() {
      it('should return a 404 code', done => {
        request.post(`${url}/api/invalid`)
        .send(exampleUser)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('bad request', function() {
      it('should return a 400 code', done => {
        request.post(`${url}/api/signup`)
        .send({username: 'test name', password: '1234'})
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', function() {
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

    describe('with a valid body', function () {
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleUser', '1234')
        .end((err, res) => {
          if (err) return done(err);
          console.log('token:', res.text);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('with an invalid body', function() {
      it('should return a 401', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleUser', '9876')
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          done();
        });
      });
    });

    describe('invalid GET route', function() {
      it('should return a 404', done => {
        request.get(`${url}/api/invalid`)
        .end((err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  });
});
