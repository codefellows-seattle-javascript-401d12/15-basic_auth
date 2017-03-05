'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Gallery = require('../model/gallery.js');
const url = `http://localhost:${process.env.PORT}`;
const serverToggle = require('./lib/server-toggle.js');

mongoose.Promise = Promise;

const server = require('../server.js');

const exampleUser = {
  username: 'tester',
  password: '1234',
  email: 'test@test.com'
};

const exampleGallery = {
  name: 'test gallery',
  desc: 'test gallery description'
};

describe('Gallery Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });
  after( done => {
    serverToggle.serverOff(server,done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Gallery.remove({})
    ])
    .then( () => done())
    .catch(done);
  });
  describe('POST: /api/gallery', () => {
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
    it('should return a gallery', done => {
      request.post(`${url}/api/gallery`)
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal(exampleGallery.name);
        expect(res.body.desc).to.equal(exampleGallery.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
    it('should return a 401 unauthorized', done => {
      request.post(`${url}/api/gallery`)
      .send(exampleGallery)
      .end((err, res) => {
        let date = new Date(res.body.created).toString();
        expect(err).to.be.an('error');
        expect(res.status).to.equal(401);
        expect(date).to.equal('Invalid Date');
        done();
      });
    });
    it('should return a 400 bad request', done => {
      request.post(`${url}/api/gallery`)
      .send({name: 10})
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        let date = new Date(res.body.created).toString();
        expect(err).to.be.an('error');
        expect(res.status).to.equal(400);
        expect(date).to.equal('Invalid Date');
        done();
      });
    });
  });
  describe('GET: /api/gallery/:id', () => {
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
      exampleGallery.userID = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });
    after( () => {
      delete exampleGallery.userID;
    });
    it('should return a gallery', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
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
    it('should return a 401', done => {
      request.get(`${url}/api/gallery/${this.tempGallery._id}`)
      .end((err, res) => {
        expect(err).to.be.an('error');
        expect(res.status).to.equal(401);
        done();
      });
    });
    it('should return a 404', done => {
      request.get(`${url}/api/gallery/586d2d44e61cdb0a8bdd1c69`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(err).to.be.an('error');
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('PUT: /api/gallery/:id', () => {
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
      exampleGallery.userID = this.tempUser._id.toString();
      new Gallery(exampleGallery).save()
      .then( gallery => {
        this.tempGallery = gallery;
        done();
      })
      .catch(done);
    });
    after( () => {
      delete exampleGallery.userID;
    });
    it('should update gallery', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send({name: 'update name', desc: 'update desc'})
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal('update name');
        expect(res.body.desc).to.equal('update desc');
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
    it('should return 401', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send({name: 'update name', desc: 'update desc'})
      .end((err, res) => {
        expect(err).to.be.an('error');
        expect(res.status).to.equal(401);
        done();
      });
    });
    it('should return 400', done => {
      request.put(`${url}/api/gallery/${this.tempGallery._id}`)
      .send({blah: 'blah'})
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(err).to.be.an('error');
        expect(res.status).to.equal(400);
        done();
      });
    });
    it('should return 404', done => {
      request.put(`${url}/api/gallery/586d2d44e61cdb0a8bdd1c69`)
      .send(exampleGallery)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(err).to.be.an('error');
        expect(res.status).to.equal(404);
        done();
      });
    });
  });
  describe('DELETE: /api/gallery/:id', () => {
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
    after( () => {
      delete exampleGallery.userID;
    });
    it('should delete a gallery', done => {
      request.delete(`${url}/api/gallery/${this.tempGallery._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        expect(res.status).to.equal(204);
        expect(res.body).to.be.empty;
        done();
      });
    });
  });
});
