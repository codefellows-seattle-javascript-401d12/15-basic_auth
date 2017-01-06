'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Photobook = require('../model/photobook.js');

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const examplePhotobook = {
  name: 'test photobook',
  desc: 'test photobook description'
};

const examplePic = {
  name: 'example pic',
  desc: 'example pic description',
  image: `${__dirname}/data/tester.png`
};

var tokenToDelete = '';
var photobookToDelete = '';
var picToDelete = '';

describe('Pic Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  after( done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Photobook.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/photobook/:id/pic', function() {
    describe('with a valid token and valid data', function() {
      before( done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          tokenToDelete = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        examplePhotobook.userID = this.tempUser._id.toString();
        examplePic.userID = this.tempUser._id.toString();
        new Photobook(examplePhotobook).save()
        .then( photobook => {
          this.tempPhotobook = photobook;
          photobookToDelete = photobook;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete examplePhotobook.userID;
        done();
      });

      it('should return a pic', done => {
        request.post(`${url}/api/photobook/${this.tempPhotobook._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .field('desc', examplePic.desc)
        .attach('image', examplePic.image)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          photobookToDelete = res.body;
          expect(res.body.name).to.equal(examplePic.name);
          expect(res.body.desc).to.equal(examplePic.desc);
          expect(res.body.photobookID).to.equal(this.tempPhotobook._id.toString());
          done();
        });
      });
    });
  });

  describe('DELETE: /api/photobook/:id/pic/picID', function() {
    describe('with a valid token and valid data', function() {

      afterEach( done => {
        delete examplePhotobook.userID;
        done();
      });

      it('should delete a pic from picgram', done => {
        request.delete(`${url}/api/photobook/${photobookToDelete._id}/pic/${picToDelete._id}`)
        .set({
          Authorization: `Bearer ${tokenToDelete}`
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
