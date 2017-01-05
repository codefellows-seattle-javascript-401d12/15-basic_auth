'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');


const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const testHelper = require('./lib/test-helper.js');
const testData = require('./lib/test-data.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleUser = testData.exampleUser;
const exampleGallery = testData.exampleGallery;

describe('Gallery Routes', function(){
  afterEach(done => testHelper.databaseCleanUp(done));
  describe('POST: /api/gallery', () => {
    describe('with a valid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });
      it('should return a gallery', done => {
        request.post(`${url}/api/gallery`)
        .send(exampleGallery)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err,res) => {
          if(err) return done(err);
          let date = new Date(res.body.created).toString();
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleGallery.name);
          expect(res.body.desc).to.equal(exampleGallery.desc);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          expect(date).to.not.equal('Invalid Date');
          done();
        });
      });
    });

    describe('with an invalid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });
      it('should return bad request', done => {
        request.post(`${url}/api/gallery/`)
        .send()
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end(res => {
          expect(res.status).to.equal(400);
          expect(res.body).to.equal(undefined);
          done();
        });
      });
    });

    describe('with no token provided', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          done();
        })
        .catch(done);
      });
      it('should return an authentication error', done => {
        request.post(`${url}/api/gallery`)
        .send(exampleUser)
        .set({
          Authorization: 'Bearer '
        })
        .end(res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('GET: /api/gallery/:id', () => {
    describe('with a valid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return a gallery', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err,res) => {
          if(err) return done(err);
          let date = new Date(res.body.created).toString();
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(exampleGallery.name);
          expect(res.body.desc).to.equal(exampleGallery.desc);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          expect(date).to.not.equal('Invalid Date');
          done();
        });
      });
    });

    describe('with a valid body and invalid id', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return not found', done => {
        request.get(`${url}/api/gallery/586d31083028a67029633e5f`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end(res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with no token', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return authentication error', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authentication: `Bearer ${this.tempToken}`
        })
        .end(res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('PUT: /api/gallery/:id', () => {
    describe('with a valid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return a gallery', done => {
        var updated = {name: 'new gallery name', desc: 'new description'};
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(updated)
        .end((err,res) => {
          if(err) return done(err);
          // let date = new Date(res.body.created).toString();
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('new gallery name');
          expect(res.body.desc).to.equal('new description');
          done();
        });
      });
    });

    describe('with a valid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return not found', done => {
        var updated = {name: 'new name'};
        request.put(`${url}/api/gallery/586d54417908e626fd678293`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(updated)
        .end(res => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    });

    describe('with an invalid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return bad request', done => {
        var updated = { test: 'test'};
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .send(updated)
        .end(res => {
          // let date = new Date(res.body.created).toString();
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

    describe('without a token', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should return authorization error', done => {
        var updated = {name: 'new name'};

        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authorization: 'Bearer '
        })
        .send(updated)
        .end(res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/gallery/:id', () => {
    describe('with a valid body', () => {
      before(done => {
        new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
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
        .then(gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
      });
      after(() => {
        delete exampleGallery.userID;
      });
      it('should remove the gallery', done => {
        request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err,res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          expect(res.body.name).to.equal(undefined);
          done();
        });
      });
    });
  });
});
