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

const url = `http://localhost:${process.env.PORT}/api/album`;

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
      return user.generateToken();
    })
    .then( token =>{
      this.token = token;
      done();
    })
   .catch(done);
  });
  after( done =>{
    Album.remove({})
      .then( () => {
        debug('testAlbum deleted');
        done();
      })
    .catch(done);
  });
  after( done =>{
    User.remove({})
      .then( () => {
        debug('testUser deleted');
        done();
      })
    .catch(done);
  });

  describe('POST ', () => {
    it('should post request with a valid body', done => {
      debug('should post request with a valid body');
      request.post(`${url}`)
     .set({Authorization: `Bearer ${this.token}`})
     .send(testAlbum)
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       expect(res.body.name).to.equal('testName');
       expect(res.body.desc).to.equal('testDesc');
       done();
     });
    });

    it('should say no token was provided', done => {
      debug('should say no token was provided');
      request.post(`${url}`)
     .send(testAlbum)
     .end( (err, res) => {
       expect(res.status).to.equal(401);
       expect(res.text).to.equal('UnauthorizedError');
       done();
     });
    });

    it('should say route is not registered', done => {
      debug('should say route is not registered');
      request.post(`${url}/akk`)
     .set({Authorization: `Bearer ${this.token}`})
     .send(testAlbum)
     .end( (err, res) => {
       expect(res.status).to.equal(404);
       done();
     });
    });
    it('should say no body was provided or if the body was invalid', done => {
      debug('no body was provided or if the body was invalid');
      request.post(`${url}`)
     .set({Authorization: `Bearer ${this.token}`})
     .send({name: 'abc'})
     .end( (err, res) => {
       expect(res.status).to.equal(400);
       done();
     });
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
      .set({
        Authorization: `Bearer ${this.token}`
      })
     .end( (err, res) => {
       if(err) return done(err);

       expect(res.status).to.equal(200);
       expect(res.body.name).to.equal('testName');
       expect(res.body.desc).to.equal('testDesc');
       done();
     });
    });
    it('should say no token was provided', done => {
      debug('no token');
      request.get(`${url}/${this.testAlbum._id}`)
     .end( (err, res) => {
       expect(res.status).to.equal(401);
       done();
     });
    });

    it('valid request with an id that was not found', done => {
      debug('id not found');
      request.get(`${url}/123456789000`)
     .set({Authorization: `Bearer ${this.token}`})
     .end( (err, res) => {
       expect(res.status).to.equal(404);
       done();
     });
    });

  });

  describe('PUT ROUTES', () => {
    before( done => {
      testAlbum.userID = this.testUser._id;
      new Album(testAlbum).save()
      .then( album =>{
        this.testAlbum = album;
        done();
      })
     .catch(done);
    });
    it('should update the album', done => {
      debug('valid request with valid body');
      request.put(`${url}/${this.testAlbum._id}`)
      .set({
        Authorization: `Bearer ${this.token}`
      })
      .send({name:'update name'})
      .end( (err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('update name');
        expect(res.body.desc).to.equal('testDesc');

        done();
      });
    });
    it('should say no token was provided', done => {
      debug('put: no token');
      request.put(`${url}/${this.testAlbum._id}`)
     .send({'name':'update name'})
     .end( (err, res) => {
       expect(res.status).to.equal(401);
       expect(res.text).to.equal('UnauthorizedError');
       done();
     });
    });
    it('should say invalid body', done => {
      debug('put: invalid body in valid request');
      request.put(`${url}/${this.testAlbum._id}`)
      .set({Authorization: `Bearer ${this.token}`})
     .send({'apple': 'some'})
     .end( (err, res) => {
       expect(res.status).to.equal(400);
       expect(res.text).to.equal('BadRequestError');
       done();
     });
    });
    it('should  say valid request made with an invalid id', done => {
      debug('put: valid body invalid id');
      request.put(`${url}//5871546b8ad39926589b0000`)
     .set({Authorization:`Bearer ${this.token}`})
     .send({name: 'update name'})
     .end( (err, res) => {
       expect(res.status).to.equal(404);
       done();
     });
    });
  });
  describe('DELETE ROUTES', () => {
    before( done => {
      testAlbum.userID = this.testUser._id;
      new Album(testAlbum).save()
      .then( album =>{
        this.testAlbum = album;
        done();
      })
     .catch(done);
    });
    it('should delete the album', done => {
      debug('valid request valid id');
      request.delete(`${url}/${this.testAlbum._id}`)
      .set({
        Authorization: `Bearer ${this.token}`
      })
      .end( (err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(200);
        done();
      });
    });
    it('should say no token was provided', done => {
      debug('delete: no token');
      request.delete(`${url}/${this.testAlbum._id}`)
     .end( (err, res) => {
       expect(res.status).to.equal(401);
       expect(res.text).to.equal('UnauthorizedError');
       done();
     });
    });
    it('should  say an invalid id', done => {
      debug('delete: valid body invalid id');
      request.delete(`${url}//5871546b8ad39926589b0000`)
     .set({Authorization:`Bearer ${this.token}`})
     .end( (err, res) => {
       expect(res.status).to.equal(404);
       done();
     });
    });
  });
});
