'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Student = require('../model/student.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

require('../server.js');

const sampleUser = {
  username: 'Test user',
  email: 'Test@test.com',
  password: 'Testword'
};

const sampleStudent = {
  name: 'Test student',
  age: 99
};

describe('Student routes', function() {
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Student.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

  describe('POST: /api/student', () => {
    beforeEach(done => {
      new User(sampleUser)
      .createHash(sampleUser.password)
      .then(user => {
        this.tempUser = user;
        return user.createToken();
      })
      .then(token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    describe('With a valid body', () =>  {
      it('should return a student', done => {
        request
        .post(`${url}/api/student`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .send(sampleStudent)
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(sampleStudent.name);
          expect(response.body.age).to.equal(sampleStudent.age);
          expect(response.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('With no token', () => {
      it('should return a 401 unauthorized error', done => {
        request
        .post(`${url}/api/student`)
        .send(sampleStudent)
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(401);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });

    describe('With no body', () => {
      it('should return a 400 bad request error', done => {
        request
        .post(`${url}/api/student`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          expect(err).to.be.an('error');
          expect(response.status).to.equal(400);
          expect(response.body.name).to.equal(undefined);
          done();
        });
      });
    });
  });

  describe('GET: /api/student/:id', () => {
    beforeEach(done => {
      new User(sampleUser)
      .createHash(sampleUser.password)
      .then(user => {
        this.tempUser = user;
        return user.createToken();
      })
      .then(token => {
        this.tempToken = token;
        sampleStudent.userID = this.tempUser._id;
        return new Student(sampleStudent).save();
      })
      .then(student => {
        this.tempStudent = student;
        done();
      })
      .catch(done);
    });

    describe('With no ID', () => {
      it('should return an array of all student IDs', done => {
        request
        .get(`${url}/api/student`)
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

    describe('With a valid ID', () => {
      it('should return a student', done => {
        request
        .get(`${url}/api/student/${this.tempStudent._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end((err, response) => {
          if (err) return done(err);
          expect(response.status).to.equal(200);
          expect(response.body.name).to.equal(sampleStudent.name);
          expect(response.body.age).to.equal(sampleStudent.age);
          expect(response.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });
  });
});
