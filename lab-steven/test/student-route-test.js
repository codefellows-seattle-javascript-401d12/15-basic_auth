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

  describe('POST: /api/student', () => {
    describe('With a valid body', () =>  {
      before(done => {
        sampleStudent.userID = this.tempUser._id;
        new Student(sampleStudent).save()
        .then(student => {
          this.tempStudent = student;
          done();
        })
        .catch(done);
      });

      after(done => {
        Promise.all([
          Student.remove({}),
          User.remove({})
        ])
        .then(() => done())
        .catch(done);
      });

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
  });
});
