'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const server = require('../server.js');
const serverController = require('./lib/server-controller.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');
const mockData = require('./lib/mockData.js');

const PORT = process.env.PORT;
const url = `http://localhost:${PORT}`;

mongoose.promise = Promise;

describe('Authorization Routes', function() {
  before( done => {
    serverController.serverOpen(server, done);
  });
  after( done => {
    serverController.serverClose(server, done);
  });

  describe('POST: /api/signup', function() {
    afterEach( done => {
      afterController.removeUser(done);
    });
    describe('Valid Body', function() {
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
          .send(mockData.testUser)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
    describe('Invalid Body', function() {
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
    beforeEach( done => {
      beforeController.createUser(done);
    });
    afterEach( done => {
      afterController.removeUser(done);
    });
    describe('Valid Body', function() {
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
