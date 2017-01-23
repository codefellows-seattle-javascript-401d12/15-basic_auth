'use strict'

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'example user',
  password: '1234',
  email: 'user@test.com'
};

describe('Auth Routes', function() {
  describe('POST: /api/signup', function() {
    describe('with valid body', function() {
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
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe('invalid POST request', () => {

        it('should return 400 status code for bad request', (done) => {
          request.post(`${url}/api/signup`)
          .send({username: 777, password: '', email:''})
          .end((err, res) => {
            expect(res.status).to.equal(400);
            done();
          });
        });
      });
    });

  describe('GET: /api/signin', function() {
    describe('with valid body', function() {
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

      it('should return token', done => {
        request.get(`${url}/api/signin`)
        .auth('example user', '1234')
        .end((err, res) => {
          if (err) return done (err);
          expect(res.status).to.equal(200);
          done();
        });
      });

      describe('invalid GET request', () => {

        it('should return 401 status code when user cannot be authenticated', (done) => {
          request.get(`${url}/api/signin`)
          .auth('example user', '777')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            done();
          });
        });
      });
    });
  });
