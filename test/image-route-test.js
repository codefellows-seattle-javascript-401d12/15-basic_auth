'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('cfgram:pic-router-test');
const server = require('../server.js');
const serverController = require('./lib/server-controller.js');
const beforeController = require('./lib/before-controller.js');
const afterController = require('./lib/after-controller.js');
const mockData = require('./lib/mockData.js');

const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

const url = `http://localhost:${process.env.PORT}`;

describe('Image Routes', function() {
  before( done => {
    serverController.serverOpen(server, done);
  });
  after( done => {
    serverController.serverClose(server, done);
  });

  afterEach( done => {
    afterController.removeGalleryUserAndImage(done);
  });

  describe('POST: /api/gallery/:galleryID/image', function() {
    describe('Valid Token & Data', () => {
      before( done => {
        new User(mockData.testUser)
        .genPasswordHash(mockData.testUser.password)
        .then( user =>  user.save())
        .then( user => {
          this.tempUser = user;
          return user.genToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });
      after( done => {
        afterController.removeGalleryAndUser(done);
      });
      before( done => {
        mockData.testGallery.userID = this.tempUser._id.toString();
        new Gallery(mockData.testGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after( done => {
        afterController.deleteTestGalleryUserId(done);
      });
      it('should return a pic', done => {
        request.post(`${url}/api/gallery/${this.tempGallery._id}/image`)
          .set({ Authorization: `Bearer ${this.tempToken}`})
          .field('name', mockData.testImage.name)
          .field('description', mockData.testImage.desc)
          .attach('image', mockData.testImage.image)
          .end((err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
  });

  // describe('DELETE: /api/gallery/:galleryID/image/:imageID', () => {
  //   before( done => {
  //     mockData.testGallery.userID = this.tempUser._id.toString();
  //     new Gallery(mockData.testGallery).save()
  //     .then( gallery => {
  //       this.tempGallery = gallery;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //   after( done => {
  //     afterController.deleteTestGalleryUserId(done);
  //   });
  //   it('should delete the requested data object and return 204', done => {
  //     request.delete(`${url}/api/gallery/${this.tempGallery._id}/image/`)
  //       .end( (err, res) => {
  //         if(err) return done(err);
  //         expect(res.status).to.equal(204);
  //         done();
  //       });
  //   });
  //   it('should return a bad request 400 error', done => {
  //     request.delete(`${url}/api/gallery/123456/image/123456`)
  //       .end( res => {
  //         expect(res.status).to.equal(404);
  //         done();
  //       });
  //   });
  //
  // });
});
