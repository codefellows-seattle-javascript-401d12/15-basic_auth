'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Photobook = require('../model/photobook.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const examplePhotobook = {
  name: 'test photobook',
  desc: 'test photobook description'
};

mongoose.Promise = Promise;

describe('Photobook Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Photobook.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/photobook', () => {
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

    it('should return a photobook', done => {
      request.post(`${url}/api/photobook`)
      .send(examplePhotobook)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(examplePhotobook.name);
        expect(res.body.desc).to.equal(examplePhotobook.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('POST: /api/photobook', () => {
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

    it('should return a 401 status code if no token provided', done => {
      request.post(`${url}/api/photobook`)
      .send(examplePhotobook)
      .set({})
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(err).to.be.an('error');
        done();
      });
    });
  });

  describe('POST: /api/photobook', () => {
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

    it('should return a 400 status code for invalid/no body', done => {
      request.post(`${url}/api/photobook`)
      .send({})
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .set('Content-type', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(err).to.be.an('error');
        done();
      });
    });

    it('should return a 404 not found status', done => {
      request.post(`${url}/api/nonexistent`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(err).to.be.an('error');
        done();
      });
    });
  });

  describe('PUT: /api/photobook/:id', () => {
    before(done => {
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
      examplePhotobook.userID = this.tempUser._id.toString();
      new Photobook(examplePhotobook).save()
      .then( photobook => {
        this.tempPhotobook = photobook;
        done();
      })
      .catch(done);
    });

    after(() => {
      delete examplePhotobook.userID;
    });

    it('should return a 200 status', done => {
      let newPhotobook = {
        name: 'new name',
        desc:'new description'
      };

      request.put(`${url}/api/photobook/${this.tempPhotobook._id}`)
      .send(newPhotobook)
      .set({
        Authorization: `Bearer ${this.tempToken}`,
      })
      .end((err, res) => {
        if (err)return done(err);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(res.body.name).to.equal(newPhotobook.name);
        expect(res.body.desc).to.equal(newPhotobook.desc);
        this.tempPhotobook = res.body;
        expect(res.status).to.equal(200);
        done();
      });
    });

    describe('with no body or invalid body', () => {

      it('should return a bad request status code of 400', done => {
        request.put(`${url}/api/photobook/${this.tempPhotobook._id}`)
        .set('Content-type', 'application/json')
        .send('test string')
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(err).to.be.an('error');
          done();
        });
      });
    });

    describe('with PUT for requests where no token was provided', () => {
      let newPhotobook = {
        name: 'new name',
        desc:'new description'
      };

      it('should return a status code of 401', done => {
        request.put(`${url}/api/photobook/${this.tempPhotobook._id}`)
        .set('Content-type', 'applications/json')
        .send(newPhotobook)
        .set({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.be.an('error');
          done();
        });
      });
    });

    describe('testing a non-existent route', function() {
      it('should return a 404 not found status', done => {
        request.put(`${url}/api/nonexistent`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.be.an('error');
          done();
        });
      });
    });
  });

  describe('GET: /api/photobook/:id', () => {
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
      examplePhotobook.userID = this.tempUser._id.toString();
      new Photobook(examplePhotobook).save()
      .then( photobook => {
        this.tempPhotobook = photobook;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete examplePhotobook.userID;
    });

    it('should return a photobook', done => {
      request.get(`${url}/api/photobook/${this.tempPhotobook._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(examplePhotobook.name);
        expect(res.body.desc).to.equal(examplePhotobook.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        expect(res.status).to.equal(200);
        done();
      });
    });
  });

  describe('testing a non-existent route', function() {
    it('should return a 404 not found status', done => {
      request.get(`${url}/api/nonexistent`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(err).to.be.an('error');
        done();
      });
    });
  });

  describe('testing invalid GET request if no token was provided', () => {
    it('should return a 401 status code', done => {
      request.get(`${url}/api/photobook/${this.tempPhotobook._id}`)
      .set({ })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(err).to.be.an('error');
        done();
      });
    });
  });
});
