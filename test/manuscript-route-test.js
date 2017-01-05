'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Manuscript = require('../model/manuscript.js');
const User = require('../model/user.js');
const Publisher = require('../model/publisher.js');

mongoose.Promise = Promise;

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const testUser = {
  username: 'testuser',
  password: '55555',
  email: 'testuser@test.com'
};

const testPublisher = {
  name: 'test publisher',
  desc: 'test publisher description'
};

const testManuscript = {
  name: 'test txt file',
  desc: 'test file description',
  doc: `${__dirname}/data/tester.txt`
};

describe('Manuscript Routes', function() {
  before(done => {
    serverToggle.serverOn(server, done);
  });

  after(done => {
    serverToggle.serverOff(server, done);
  });

  afterEach(done => {
    Promise.all([
      Manuscript.remove({}),
      User.remove({}),
      Publisher.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

  describe('POST: /api/publisher/:publisherID/manuscript', function() {
    describe('with a valid token and valid data', function() {
      before(done => {
        new User(testUser)
        .generatePasswordHash(testUser.password)
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
        testPublisher.userID = this.tempUser._id.toString();
        new Publisher(testPublisher).save()
        .then(publisher => {
          this.tempPublisher = publisher;
          done();
        })
        .catch(done);
      });

      after(done => {
        delete testPublisher.userID;
        done();
      });

      it.only('should return a txt file', done => {
        request.post(`${url}/api/publisher/${this.tempPublisher._id}/manuscript`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', testManuscript.name)
        .field('desc', testManuscript.desc)
        .attach('doc', testManuscript.doc)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal(testManuscript.name);
          expect(res.body.desc).to.equal(testManuscript.desc);
          expect(res.body.publisherID).to.equal(this.tempPublisher._id.toString());
          done();
        });
      });

    });
  });


});
