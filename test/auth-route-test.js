'use strict';


const expect = require('chai').expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const request = require('superagent');
const User = require('../model/user.js');
const debug = require('debug')('cfgram:auth-route-test');

mongoose.Promise = Promise;

require('../server.js');

const url = `user://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleUser',
  password: '1234',
  email: 'exampleuser@test.com'
};

describe('Auth routes', function(){
  describe('POST: /api/signup', function(){
    debug('POST: /api/signup');

    after( done => {
      User.remove({})
      .then( () => done())
      .catch(done);
    });

    it('should return a token', done => {
      require.post(`${url}/api/signup`)
      .send((err, res) => {
        if(err) return done(err);

        console.log('\ntoken: ', res.text);
        expect(res.status).to.equal(200);
      });
    });


  });
});
