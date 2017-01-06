'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('cfgram:pic-route-test');

const Pic = require('../model/pic.js');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

const serverToggle = require('../test/lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'example name',
  password: '1234',
  email: 's@email.com'
};

const exampleGallery = {
  name: 'test gallery',
  desc: 'example description'
};

const examplePic = {
  name: 'example pic',
  desc: 'example pic description',
  image: `${__dirname}/data/tester.png`
};

let imageData = {};

describe('Pic Routes', function(){
  before(done => {
    serverToggle.serverOn(server,done);
  });
  after(done => {
    serverToggle.serverOff(server,done);
  });
  afterEach( done => {
    Promise.all([
      Pic.remove({}),
      User.remove({}),
      Gallery.remove({})
    ])
    .then(() => done())
    .catch(done);
  });
  describe('POST: /api/gallery/:galleryID/pic', function(){
    describe('with a valid token and valid data', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });
      before(done => {
        exampleGallery.userID = this.tempUser._id.toString();
        new Gallery(exampleGallery).save()
        .then(gallery =>{
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(done => {
        delete exampleGallery.userID;
        done();
      });
      it('should return a pic', done => {
        request.post(`${url}/api/gallery/${this.tempGallery._id}/pic`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePic.name)
        .field('desc', examplePic.desc)
        .attach('image', examplePic.image)
        .end((err,res) => {
          if(err) return done(err);
          console.log('aaaaaaaaaaaaaaaaaaaaaa', res.body);
          expect(res.body.name).to.equal(examplePic.name);
          expect(res.body.desc).to.equal(examplePic.desc);
          expect(res.body.galleryID).to.equal(this.tempGallery._id.toString());
          imageData = res.body;
          done();
        });
      });

    });
  });

  // describe('DELETE: /api/gallery/:galleryID/pic/:picID', function(){
  //   describe('with a valid id', () => {
  //     before(done => {
  //       new User(exampleUser)
  //       .generatePasswordHash(exampleUser.password)
  //       .then(user => user.save())
  //       .then( user => {
  //         this.tempUser = user;
  //         return user.generateToken();
  //       })
  //       .then(token => {
  //         this.tempToken = token;
  //         done();
  //       })
  //       .catch(done);
  //     });
  //     before(done => {
  //       exampleGallery.userID = this.tempUser._id.toString();
  //       new Gallery(exampleGallery).save()
  //       .then(gallery =>{
  //         this.tempGallery = gallery;
  //         done();
  //       })
  //       .catch(done);
  //     });
  //     before(done => {
  //       console.log(imageData);
  //       examplePic.userID = this.tempUser._id.toString();
  //       examplePic.galleryID = this.tempGallery._id.toString();
  //       examplePic.imageURI = imageData.imageURI;
  //       examplePic.objectKey = imageData.objectKey;
  //       new Pic(examplePic).save()
  //       .then(pic => {
  //         this.tempPic = pic;
  //         done();
  //       })
  //       .catch(done);
  //     })
  //     after(done => {
  //       delete exampleGallery.userID;
  //       done();
  //     });
  //     it('should remove the pic', done => {
  //       request.delete(`${url}/api/gallery/${this.tempGallery._id}/pic/${this.tempPic._id}`)
  //       .set({
  //         Authorization: `Bearer ${this.tempToken}`
  //       })
  //       .end((err,res) => {
  //         if(err) return done(err);
  //         expect(res.status).to.equal(204);
  //         done();
  //       })
  //     });
  //   });
  // });
});
