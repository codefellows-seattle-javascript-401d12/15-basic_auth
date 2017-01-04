'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('cfgram:album-router-test');

const Album = require('../model/album.js');
const User = require('../model/user.js');

mongoose.Promise = Promise;

require('../server.js');

const url = `user://localhost:${process.env.PORT}/api/album`;

const testUser = {
  username: 'testUser',
  password: '1234',
  email: 'testuser@cf.com'
};
const testAlbum ={
  name: 'testName',
  desc: 'destDesc'
};


describe('album-router-test', function(){
  debug('album-router-test');
  before( done => {
    var user = new User(testUser);
    user.generatePasswordHash(testUser.password)
    .then(() => user.save())
    .then( () => user.generateToken())
    .then( token =>{
      this.token = token;
      done();
    })
   .catch(done);
  });

  afterEach( done =>{
    User.remove({})
    .then( () => done())
    .catch(done);
  });
  afterEach( done =>{
    Album.remove({})
    .then( () => done())
    .catch(done);
  });

  describe('POST ', () => {
    it('should post an Album', done => {
      request(`${url}`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send(testAlbum)
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       User.remove({});
     });
      done();
    });
  });


});
