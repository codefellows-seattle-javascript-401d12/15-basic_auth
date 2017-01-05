'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

require('../server.js');

const exampleUser = {
  username: 'exampleUser',
  password: '1234',
  email: 'exampleUser@test.com'
};

const exampleGallery = {
  name: 'Example Gallery',
  desc: 'test gallery description',
};

describe('Gallery Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/gallery', () => {
    before( done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
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

    it('should return a gallery', done => {
      request.post(`${url}/api/gallery`)
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleGallery.name);
        expect(res.body.desc).to.equal(exampleGallery.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('invalid POST route', function() {
    it('should return a 404 code', done => {
      request.post(`${url}/api/invalid`)
      .send(exampleGallery)
      .end((err, res) => {
        expect(err).to.be.an('error');
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('GET: /api/gallery/:id', () => {
    beforeEach(done => {
      let user = new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        exampleGallery.userID = this.tempUser._id;
        return new Gallery(exampleGallery).save();
      })
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    describe('with no ID', () => {
      it('should return an array of all gallery IDs', done => {
        request
        .get(`${url}/api/gallery`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body).to.be.an('array');
          expect(response.body.length).to.be.at.least(1);
          done();
        });
      });
    });

    describe('with a valid ID', () => {
      it('should return a gallery', done => {
        request
        .get(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(exampleGallery.name);
          expect(response.body.desc).to.equal(exampleGallery.desc);
          expect(response.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('with no token', () => {
      it('should return a 401 unauthorized error', done => {
        request
        .get(`${url}/api/gallery/${this.tempGallery._id}`)
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(401);
          // expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });

    describe('with an invalid id', () => {
      it('should return a 404 not found error', done => {
        request
        .get(`${url}/api/gallery/69`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(404);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });
  });

  describe('PUT: /api/gallery/:id', () => {
    beforeEach(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        exampleGallery.userID = this.tempUser._id;
        return new Gallery(exampleGallery).save();
      })
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    describe('with a valid body and token', () => {
      it('should return a gallery', done => {
        request
        .put(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .send({name: 'New name', desc: 10})
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal('New name');
          expect(response.body.desc).to.equal(10);
          expect(response.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('with no token provided', () => {
      it('should return a 401 error', done => {
        request
        .put(`${url}/api/gallery/${this.tempGallery._id}`)
        .send({name: 'New name', desc: 10})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(401);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });

    describe('with no body provided', () => {
      it('should return a 400 error', done => {
        request
        .put(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(400);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });

    describe('with the wrong ID', () => {
      it('should return a 404 not found error', done => {
        request
        .put(`${url}/api/gallery/69`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .send({name: 'New name', desc: 10})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(404);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });
  });

  describe('DELETE: /api/gallery/:id', () => {
    beforeEach(done => {
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then(user => {
        this.tempUser = user;
        return user.generateToken();
      })
      .then(token => {
        this.tempToken = token;
        exampleGallery.userID = this.tempUser._id;
        return new Gallery(exampleGallery).save();
      })
      .then(gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });

    describe('with a valid ID and token', () => {
      it('should return a 204 status', done => {
        request
        .delete(`${url}/api/gallery/${this.tempGallery._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(204);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });

    describe('with an invalid ID', () => {
      it('should return a 404 not found error', done => {
        request
        .delete(`${url}/api/gallery/invalid`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(404);
          done();
        });
      });
    });

    describe('without a token', () => {
      it('should return a 401 unauthorized error', done => {
        request
        .delete(`${url}/api/gallery/${this.tempGallery._id}`)
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(401);
          done();
        });
      });
    });
  });
});
