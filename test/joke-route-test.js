'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const Mongoose = require('mongoose');
const Promise = require('bluebird');
const User = require('../model/user.js');
const Joke = require('../model/joke.js');

Mongoose.Promise = Promise;

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: 'examplepassword',
  email: 'example@email.com'
};

const exampleJoke = {
  setup: 'Why was Hillary Clinton in Times Square on New Year\'s Eve?',
  punchline: 'They needed someone who could drop the ball at the last second.',
  mature: false
};

const exampleUpdatedJoke = {
  setup: 'My best friend promised to stop taking credit for my accomplishments...',
  punchline: 'but today, he called to brag about getting his wife pregnant.',
  mature: true
};

const exampleBadJoke = {
  setup: 15,
  punchliiiiiine: 'because',
  mature_content: true
};

describe('Joke routes', function() {

  beforeEach( done => { //before each route is tested
    new User(exampleUser)
    .hashPassword(exampleUser.password)
    .then( newUser => newUser.save())
    .then( savedUser => {
      exampleJoke.user_id = savedUser._id.toString();
      this.tempUser = savedUser;
      return savedUser.generateToken();
    })
    .then( generatedToken => {
      this.tempToken = generatedToken;

      new Joke(exampleJoke).save()
      .then( savedJoke => {
        this.tempJoke = savedJoke;
        done();
      })
      .catch(err => done(err));

    })
    .catch(err => done(err));
  });

  afterEach( done => { //after each route is tested
    Promise.all([
      Joke.remove({}),
      User.remove({})
    ])
    .then( () => done())
    .catch(err => done(err));
  });

  describe('POST to /api/joke', () => {

    describe('With valid joke content in body', () => {
      it('should return status 200 and a joke in the body', done => {
        request.post(`${url}/api/joke`)
        .send(exampleJoke)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.setup).to.equal(exampleJoke.setup);
          expect(res.body.punchline).to.equal(exampleJoke.punchline);
          expect(res.body.mature).to.equal(exampleJoke.mature);
          expect(res.body.user_id).to.be.a('string');
          done();
        });
      });
    });

    describe('With INVALID content in body', () => {
      it('should return status 400 and an error', done => {
        request.post(`${url}/api/joke`)
        .send(exampleBadJoke)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('With an INVALID token', () => {
      it('should return status 401 and an error', done => {
        request.post(`${url}/api/joke`)
        .set({Authorization: 'Bearer xyzbadtoken12345'})
        .send(exampleJoke)
        .end( (err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('With a MISSING auth header', () => {
      it('should return status 401 and an error', done => {
        request.post(`${url}/api/joke`)
        .send(exampleJoke)
        .end( (err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

  }); //POST /api/joke

  describe('GET to /api/joke', () => {

    describe('With valid joke ID and token', () => {
      it('should return status 200 and a joke in the body', done => {
        request.get(`${url}/api/joke/${this.tempJoke._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.setup).to.equal(exampleJoke.setup);
          expect(res.body.punchline).to.equal(exampleJoke.punchline);
          expect(res.body.mature).to.equal(exampleJoke.mature);
          expect(res.body.user_id.toString()).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('With MISSING token and valid ID', () => {
      it('should return status 401 and an error', done => {
        request.get(`${url}/api/joke/${this.tempJoke._id}`)
        .set({authorization: 'Bearer '})
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('With a valid token and MISSING joke ID', () => {
      it('should return status 404 and an error', done => {
        request.get(`${url}/api/joke/`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

  });//GET /api/joke

  describe('PUT to /api/joke', () => {

    describe('With valid joke content and ID', () => {
      it('should return status 200 and an updated joke in the body', done => {
        request.put(`${url}/api/joke/${this.tempJoke._id}`)
        .send(exampleUpdatedJoke)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(res.body.setup).to.equal(exampleUpdatedJoke.setup);
          expect(res.body.punchline).to.equal(exampleUpdatedJoke.punchline);
          expect(res.body.mature).to.equal(exampleUpdatedJoke.mature);
          expect(res.body.user_id.toString()).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('With MISSING token and valid body', () => {
      it('should return status 401 and an error', done => {
        request.put(`${url}/api/joke/${this.tempJoke._id}`)
        .send(exampleUpdatedJoke)
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(401);
          expect(res.text).to.be.a('string');
          done();
        });
      });
    });

    describe('With a good ID and an INVALID body', () => {
      //my PUT route will update the original with any properties of the body whose type and name match
      //a property in the original joke. So it throws 204 No Content if nothing's able to be updated.
      it('should return status 204 and an error', done => {
        request.put(`${url}/api/joke/${this.tempJoke._id}`)
        .send(exampleBadJoke)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(204);
          done();
        });
      });
    });

    describe('With a MISSING ID and a valid body', () => {
      it('should return status 404 and an error', done => {
        request.put(`${url}/api/joke/`)
        .send(exampleUpdatedJoke)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(404);
          done();
        });
      });
    });
  }); //PUT /api/joke

  describe('DELETE to /api/joke', () => {

    describe('With valid ID', () => {
      it('should return status 200', done => {
        request.delete(`${url}/api/joke/${this.tempJoke._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          done();
        });
      });
    });

    describe('With INVALID joke ID', () => {
      it('should return status 400', done => {
        request.delete(`${url}/api/joke/poop${this.tempJoke._id}`)
        .set({authorization: `Bearer ${this.tempToken}`})
        .end( (err, res) => {
          expect(err).to.be.an('error');
          expect(res.status).to.equal(400);
          done();
        });
      });
    });

  }); //DELETE /api/joke

});
