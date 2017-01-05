'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('cfgram:photo-router-test');

const Photo = require('../model/photo.js');
const User = require('../model/user.js');
const Album = require('../model/album.js');

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'example user name',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleAlbum = {
  name: 'example album name',
  description: 'example album description'
};

const examplePhoto = {
  name: 'example photo name',
  description: 'example photo description',
  image: `${__dirname}/data/tester.png`
};

describe('Photo Routes', function () {

  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      Photo.remove({}),
      User.remove({}),
      Album.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/album/:id/photo', function() {
    describe('with a valid token and valid data', function() {
      beforeEach( done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });

      beforeEach( done => {
        exampleAlbum.userID = this.tempUser._id.toString();
        new Album(exampleAlbum).save()
        .then( album => {
          this.tempAlbum = album;
          done();
        })
        .catch(done);
      });

      afterEach( done => {
        delete exampleAlbum.userID;
        done();
      });

      it.only('should return a photo', done => {
        request.post(`${url}/api/album/${this.tempAlbum._id}/photo`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePhoto.name)
        .field('description', examplePhoto.description)
        .attach('image', examplePhoto.image)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.equal(examplePhoto.name);
          expect(res.body.description).to.equal(examplePhoto.description);
          expect(res.body.albumID).to.equal(this.tempAlbum._id.toString());
          done();
        });
      });
    });
  });
});
