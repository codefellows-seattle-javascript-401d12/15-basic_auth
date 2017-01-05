'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Student = require('../model/student.js');
const Assignment = require('../model/assignment.js');
const server = require('../server.js');
const serverSwitch = require('./lib/server-switch.js');
const url = `http://localhost:${process.env.PORT}`;

mongoose.Promise = Promise;

const sampleUser = {
  username: 'Test user',
  email: 'test@test.com',
  password: 'Testword'
};

const sampleStudent = {
  name: 'Test student',
  age: 30
};

const sampleAssignment = {
  name: 'Test assignment',
  details: 'Test details',
  text: `${__dirname}/data/test.txt`
};

describe('Assignment routes', function() {
  before(done => {
    serverSwitch.startServer(server, done);
  });

  after(done => {
    serverSwitch.stopServer(server, done);
  });

  afterEach(done => {
    Promise.all([
      User.remove({}),
      Student.remove({}),
      Assignment.remove({})
    ])
    .then(() => done())
    .catch(done);
  });

  describe('POST: /api/student/:studentID/assignment', function() {
    describe('With a valid token and assignment', function() {
      before(done => {
        new User(sampleUser)
        .createHash(sampleUser.password)
        .then(user => user.save())
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

      after(done => {
        delete sampleStudent.userID;
        done();
      });

      it('should return an assignment', done => {
        request
        .post(`${url}/api/student/${this.tempStudent._id}/assignment`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .field('name', sampleAssignment.name)
        .field('details', sampleAssignment.details)
        .attach('text', sampleAssignment.text)
        .end((err, response) => {
          if (err) return done(err);
          expect(response.body.name).to.equal(sampleAssignment.name);
          expect(response.body.details).to.equal(sampleAssignment.details);
          expect(response.body.studentID).to.equal(this.tempStudent._id.toString());
          done();
        });
      });
    });
  });
});
