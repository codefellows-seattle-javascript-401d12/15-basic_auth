'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: 'examplepassword',
  email: 'example@email.com'
};

const exampleDumbUser = {
  username: 'herp',
  passwerrrrrrd: 'derp',
  email: ''
};

describe('Auth routes', function() {
  describe('POST to /api/signup', function() {

    describe('with a valid body', function() {

      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/signup`)
        .send(exampleUser)
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('with an INVALID body', function() {

      after( done => {
        User.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return error 400', done => {
        request.post(`${url}/api/signup`)
        .send(exampleDumbUser)
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {

      before( done => {
        let user = new User(exampleUser);
        user.hashPassword(exampleUser.password)
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

      it('should return a token', done => {
        request.get(`${url}/api/signin`)
        .auth('exampleuser', 'examplepassword') //
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });

    });

    describe('with INVALID credentials', function() {

      before( done => {
        let user = new User(exampleUser);
        user.hashPassword(exampleUser.password)
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

      it('should return error 401', done => {
        request.get(`${url}/api/signin`)
        .auth(exampleUser.username, 'dunnopassword') //
        .end( (err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });

    });

  });
});
