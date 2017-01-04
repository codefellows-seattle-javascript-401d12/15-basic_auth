'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
const Promise = require('bluebird');
const request = require('superagent');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');

require('../server.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const testUser = {
  username: 'test user',
  password: 'testpassword',
  email: 'test@test.com'
};

const testGallery = {
  name: 'test gallery',
  description: 'test gallery description'
};

describe('Test Gallery Routes', function() {
  before( done => {
    new User(testUser)
      .genPasswordHash(testUser.password)
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
    Promise.all([
      Gallery.remove({}),
      User.remove({})
    ])
    .then( () => done())
    .catch(done);
  });
  describe('POST: /api/gallery', () => {
    describe('Valid Body', () => {
      it('should return a token', done => {
        request.post(`${url}/api/gallery`)
          .send(testGallery)
          .set({ Authorization: `Bearer ${this.tempToken}`})
          .end( (err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
    describe('Invalid Body', () => {
      it('should not return a token', done => {
        request.post(`${url}/api/gallery`)
          .send({})
          .set({ Authorization: `Bearer ${this.tempToken}`})
          .end( res => {
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
    describe('Invalid Token', () => {
      it('should fail because there is no token', done => {
        request.post(`${url}/api/gallery`)
        .send(testGallery)
        .end( res => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    });
  });

  describe('GET: /api/gallery/:id', () => {
    before( done => {
      testGallery.userID = this.tempUser._id.toString();
      new Gallery(testGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
    });
    after( () => {
      delete testGallery.userID;
    });
    describe('Valid Body', () => {
      it('should return a token', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( (err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
    describe('Invalid Request', () => {
      it('should return 404', done => {
        request.get(`${url}/api/gallery/12345`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( res => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
    describe('Missing Token', () => {
      it('should return 404', done => {
        request.get(`${url}/api/gallery/${this.tempGallery._id}`)
          .end( res => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
  });

  describe('GET: /api/gallery', () => {
    before( done => {
      testGallery.userID = this.tempUser._id.toString();
      new Gallery(testGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
    });
    after( () => {
      delete testGallery.userID;
    });
    describe('Valid Body', () => {
      it('should return all galleries', done => {
        request.get(`${url}/api/gallery`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( (err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            done();
          });
      });
    });
  });

  describe('PUT: /api/gallery/:id', () => {
    before( done => {
      testGallery.userID = this.tempUser._id.toString();
      new Gallery(testGallery).save()
        .then( gallery => {
          this.tempGallery = gallery;
          done();
        })
        .catch(done);
    });
    after( () => {
      delete testGallery.userID;
    });
    describe('Valid Body', () => {
      it('should return a new gallery', done => {
        var updated = { name: 'Updated Name', description:'updated description' };
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send(updated)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( (err, res) => {
            if(err) return done(err);
            expect(res.status).to.equal(200);
            expect(res.body.name).to.equal(updated.name);
            done();
          });
      });
    });
    describe('Missing Token', () => {
      it('should return a new gallery', done => {
        var updated = { name: 'Updated Name' };
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send(updated)
          .end( res => {
            expect(res.status).to.equal(401);
            done();
          });
      });
    });
    describe('Invalid Body', () => {
      it('should return a new gallery', done => {
        var brokenUpdate = { name: 5 };
        request.put(`${url}/api/gallery/${this.tempGallery._id}`)
          .send(brokenUpdate)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( res => {
            expect(res.status).to.equal(400);
            done();
          });
      });
    });
    describe('Valid Body', () => {
      it('should return a new gallery', done => {
        var updated = { name: 'Updated Name' };
        request.put(`${url}/api/gallery/12345`)
          .send(updated)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .end( res => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  });

  describe('DELETE: /api/gallery/:id', () => {
    it('should delete the requested data object and return 204', done => {
      request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
        .end( (err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
    });
    it('should return a bad request 400 error', done => {
      request.delete(`${url}/api/gallery/12345`)
        .end( res => {
          expect(res.status).to.equal(404);
          done();
        });
    });

  });
});
