'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Mongoose = require('mongoose');
Mongoose.Promise = require('bluebird');

const User = require('../model/user.js');
const Vid = require('../model/vid.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleVid = {
  name: 'weird meme video',
  desc: 'king of pop is interrupted by doots',
};
const exampleVidPath = `${__dirname}/../vid.mp4`;
const exampleUser = {
  username: 'exampleuser',
  password: 'examplepassword',
  email: 'example@email.com'
};


describe('Vid routes', function() {


  beforeEach( done => { //before each route is tested
    new User(exampleUser)
    .hashPassword(exampleUser.password)
    .then( newUser => newUser.save())
    .then( savedUser => {
      this.tempUser = savedUser;
      return this.tempUser.generateToken();
    })
    .then( generatedToken => {
      this.tempToken = generatedToken;
      done();
    })
    .catch(err => done(err));
  }); //beforeEach

  afterEach( done => { //after each route is tested
    Promise.all([
      Vid.remove({}),
      User.remove({})
    ])
    .then( () => done())
    .catch(err => done(err));
  }); //afterEach

  describe('POST to /api/vid', () => {

    describe('With valid token and valid file', () => {
      it('should return status 200 and a video', done => {
        request.post(`${url}/api/vid`)
        .set({desc: exampleVid.desc, name: exampleVid.name})
        .attach('video', exampleVidPath)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleVid.name);
          expect(res.body.desc).to.equal(exampleVid.desc);
          expect(res.body._id).to.be.a('string');
          expect(res.body.s3URI).to.be.a('string');
          expect(res.body.s3ObjectKey).to.be.a('string');
          expect(res.body.user_id.toString()).to.equal(this.tempUser._id.toString());
          done();
        });
      })
      .timeout(10000);
    });

    describe('With valid token and MISSING file', () => {
      it('should return status 400 and an error', done => {
        request.post(`${url}/api/vid`)
        .set({desc: exampleVid.desc, name: exampleVid.name})
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

  }); //POST /api/joke

  describe('DELETE to /api/vid', () => {

    describe('With valid joke ID and token', () => {
      it('should return status 204', done => {
        request.post(`${url}/api/vid`)
        .set({desc: exampleVid.desc, name: exampleVid.name})
        .attach('video', exampleVidPath)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          request.delete(`${url}/api/vid/${res.body._id}`)
          .set({authorization: `Bearer ${this.tempToken}`})
          .end( (err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(204);
            done();
          });
        });
      });
    });

  });//DELETE /api/vid

});
