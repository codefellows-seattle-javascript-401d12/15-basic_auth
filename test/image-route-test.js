'use strict';

const expect = require('chai').expect;
const request = require('superagent');
// const debug = require('debug')('cfgram:pic-router-test');

const Image = require('../model/image.js');
const User = require('../model/user.js');
const Vault = require('../model/vault.js');

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleVault = {
  name: 'test vault',
  desc: 'test vault description'
};

const exampleImage = {
  name: 'example image',
  desc: 'example image description',
  image: `${__dirname}/data/test.png`
};

describe('Pic Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      Image.remove({}),
      User.remove({}),
      Vault.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/vault/:vaultID/image', function() {
    describe('with a valid token and valid data', function() {
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
        exampleVault.userID = this.tempUser._id.toString();
        new Vault(exampleVault).save()
        .then( vault => {
          this.tempVault = vault;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleVault.userID;
        done();
      });

      it('should return a pic', done => {
        request.post(`${url}/api/vault/${this.tempVault._id}/image`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', exampleImage.name)
        .field('desc', exampleImage.desc)
        .attach('image', exampleImage.image)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.name).to.equal(exampleImage.name);
          expect(res.body.desc).to.equal(exampleImage.desc);
          expect(res.body.vaultID).to.equal(this.tempVault._id.toString());
          done();
        });
      });
    });
  });

  describe('DELETE:', function() {
    describe('with a vaild id', function() {
      it.only('should delete and return 204', done => {
        request.delete(`${url}/api/image/${this.tempImage._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          if(err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });
  });
});
