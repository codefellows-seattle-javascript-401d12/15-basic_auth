'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const Member = require('../model/member.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT || 8000}`;

const exampleMember = {
  username: 'examplemember',
  password: '12345678',
  email: 'exampleMember@mailtest.com'
};

describe('Auth Routes', function() {
  describe('POST: /api/createAccount', function() {
    describe('with a valid body', function() {
      after( done => {
        Member.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.post(`${url}/api/createAccount`)
        .send(exampleMember)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });
  });

  describe('GET: /api/login', function() {
    describe('with a valid body', function() {
      before( done => {
        let member = new Member(exampleMember);
        member.generatePasswordHash(exampleMember.password)
        .then( () => member.save())
        .then( () => {
          this.tempMember = member;
          done();
        })
        .catch(done);
      });

      after( done => {
        Member.remove({})
        .then( () => done())
        .catch(done);
      });

      it('should return a token', done => {
        request.get(`${url}/api/login`)
        .auth('examplemember', '12345678')
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });
  });
});
