'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('cfgram:picture-route-test');

const Picture = require('../model/picture.js');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleName',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleGallery = {
  name: 'test gallery',
  desc: 'test gallery description'
};

const examplePicture = {
  name: 'example picture',
  desc: 'example picture description',
  image: `${__dirname}/data/tester.png`
};

describe('Picture Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });
  after( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      Picture.remove({}),
      User.remove({}),
      Gallery.remove({})
    ])
    .then( () => {
      console.log('afterEach');
      done();
    })
    .catch(done);
  });

  describe('POST: /api/gallery/:galleryID/picture', function() {
    describe('with a valid token and valid data', function() {
      before( done => {
        new User ({
          username: 'blah',
          password: '1234',
          email: 'exampleuser@test.com'
        })
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
      before( done => {
        exampleGallery.userID = this.tempUser._id.toString();
        new Gallery(exampleGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Picture.remove({}),
          User.remove({}),
          Gallery.remove({})
        ])
        .then( () => {
          console.log('afterEach');
          done();
        })
        .catch(done);
      });

      it('should return a picture', done => {
        request.post(`${url}/api/gallery/${this.tempGallery._id}/picture`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePicture.name)
        .field('desc', examplePicture.desc)
        .attach('image', examplePicture.image)
        .end((err, res) =>{
          if(err) return done(err);
          expect(res.body.name).to.equal(examplePicture.name);
          expect(res.body.desc).to.equal(examplePicture.desc);
          expect(res.body.galleryID).to.equal(this.tempGallery._id.toString());
          done();
        });
      });
    });
  });
  describe('DELETE: /api/gallery/:galleryID/picture/:pictureID', function() {
    describe('with a valid id', function() {
      before( done => {
        new User ({
          username: 'blerg',
          password: '1234',
          email: 'exampleuser@test.com'
        })
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
      before( done => {
        exampleGallery.userID = this.tempUser._id.toString();
        new Gallery(exampleGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      before( done => {
        examplePicture.userID = this.tempUser._id.toString();
        new Picture(examplePicture).save()
        .then( picture => {
          this.tempPicture = picture;
          done();
        })
        .catch(done);
      });

      after( done => {
        Promise.all([
          Picture.remove({}),
          User.remove({}),
          Gallery.remove({})
        ])
        .then( () => {
          done();
        })
        .catch(done);
      });
      it('should delete a picture', done => {
        request.delete(`${url}/api/gallery/${this.tempGallery._id}/picture/${this.tempPicture._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send({Bucket: process.env.AWS_BUCKET, Key: this.tempPictureture.objectkey})
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
