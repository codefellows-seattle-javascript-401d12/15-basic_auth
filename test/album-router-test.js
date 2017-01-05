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
  desc: 'testDesc'
};


describe('album-router-test', function(){
  debug('album-router-test');
  before( done => {
    var user = new User(testUser);
    user.generatePasswordHash(testUser.password)
    .then(() => user.save())
    .then( () => {
      this.testUser = user;
      user.generateToken();
    })
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
    it('should post request with a valid body', done => {
      debug('should post request with a valid body');
      request.post(`${url}`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send(testAlbum)
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       expect(res.body.name).to.equal('testName');
       expect(res.body.desc).to.equal('testDesc');
     });
      done();
    });

    it('should say no token was provided', done => {
      debug('should say no token was provided');
      request.post(`${url}`)
     .send(testAlbum)
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(401);
     });
      done();
    });

    it('should say route is not registered', done => {
      debug('should say route is not registered');
      request.post(`${url}/akk`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send(testAlbum)
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(404);
     });
      done();
    });
    it('should say no body was provided or if the body was invalid', done => {
      debug('no body was provided or if the body was invalid');
      request.post(`${url}`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send({name: 'abc'})
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(400);
     });
      done();
    });
  });

  describe('GET ', () => {
    before( done => {
      testAlbum.userID = this.testUser._id;
      new Album(testAlbum).save()
      .then( album =>{
        this.testAlbum = album;
        done();
      })
     .catch(done);
    });
    it('should get an Album', done => {
      debug('get an album');
      request.get(`${url}/${this.testAlbum._id}`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       expect(res.body.name).to.equal('testName');
       expect(res.body.desc).to.equal('testDesc');
     });
      done();
    });
    it('should say no token was provided', done => {
      debug('no token');
      request.get(`${url}/${this.testAlbum._id}`)
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(401);
       User.remove({});
     });
      done();
    });

    it('valid request with an id that was not found', done => {
      debug('id not found');
      request.get(`${url}/123456789000`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(404);
     });
      done();
    });

  });

  describe('PUT ', () => {
    debug('put');
    before( done => {
      testAlbum.userID = this.testUser._id;
      new Album(testAlbum).save()
      .then( album =>{
        this.testAlbum = album;
        done();
      })
     .catch(done);
    });
    it('should put request with a valid body', done => {
      debug('put valid body valid request');
      request.put(`${url}/${this.testAlbum._id}`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send({name: 'update name'})
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       expect(res.body.name).to.equal('update name');
       expect(res.body.desc).to.equal('testDesc');
     });
      done();
    });
    it('should say no token was provided', done => {
      debug('put: no token');
      request.put(`${url}/${this.testAlbum._id}`)
     .send({name: 'update name'})
     .end( (err, res) => {
       if(err) return done(err);
       console.log(res.msg);
       expect(res.status).to.equal(401);
     });
      done();
    });
    it('should say invalid body', done => {
      debug('put: invalid body in valid request');
      request.put(`${url}/${this.testAlbum._id}`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send({Name: 'update name', content: 'some'})
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(400);
     });
      done();
    });
    it('should  say valid request made with an invalid id', done => {
      debug('put: valid body invalid id');
      request.put(`${url}/1234567890123456789`)
     .set({Authorization: `Bearer ${this.temptoken}`})
     .send({name: 'update name'})
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       expect(res.body.name).to.equal('update name');
       expect(res.body.desc).to.equal('testDesc');
     });
      done();
    });
  });
});
