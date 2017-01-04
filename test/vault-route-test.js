'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Vault = require('../model/vault.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleVault = {
  name: 'test vault',
  desc: 'test vault description'
};

describe('Vault Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Vault.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/vault', () => {
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

    it('should return a vault', done => {
      request.post(`${url}/api/vault`)
      .send(exampleVault)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleVault.name);
        expect(res.body.desc).to.equal(exampleVault.desc);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
    it('should throw a 401 if no token provided', done => {
      request.post(`${url}/api/vault`)
      .send(exampleVault)
      .set({}) //this should be not return a token
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(err).to.be.an('error');
        done();
      });
    });
    it('should thow a 400 with invalid body', done => {
      request.post(`${url}/api/vault`)
      .send({name: 'invalid name'})
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end(res => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('GET:/api/vault/:id', () => {
    before( done => {
      new User (exampleUser)
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
      exampleVault.userID = this.tempUser._id.toString();
      new Vault( exampleVault).save()
      .then( vault => {
        this.tempVault = vault;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete exampleVault.user.ID;
    });

    it('should return a vault', done => {
      request.get(`${url}/api/vault/${this.tempVault._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleVault.name);
        expect(res.body.desc).to.equal(exampleVault.desc);
        expect(res.body.userID).to.equal(this.tempUser._id).toString();
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

});
