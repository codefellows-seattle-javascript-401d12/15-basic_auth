'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const User = require('../model/user.js');
const Album = require('../model/album.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleUser = {
  username: 'exampleuser',
  password: '1234',
  email: 'exampleuser@test.com'
};

const exampleAlbum = {
  name: 'example album name',
  description: 'example album description'
};

mongoose.Promise = Promise;

describe('Album Routes', function() {
  afterEach( done => {
    Promise.all([
      User.remove({}),
      Album.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/album', () => {
    before( done => {
      // console.log('::: reached inside album POST before test');
      new User(exampleUser)
      .generatePasswordHash(exampleUser.password)
      .then( user => user.save())
      .then( user => {
        this.tempUser = user;
        // console.log('::: gallery POST test user is', user);
        // console.log('::: album POST test user is:', user);
        return user.generateToken();
      })
      .then( token => {
        this.tempToken = token;
        done();
      })
      .catch(done);
    });

    it('SHOULD RETURN AN ALBUM', done => {
      request.post(`${url}/api/album`)
      .send(exampleAlbum)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleAlbum.name);
        expect(res.body.description).to.equal(exampleAlbum.description);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('GET: /api/album/:id', () => {
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
      exampleAlbum.userID = this.tempUser._id.toString();
      new Album(exampleAlbum).save()
      .then( album => {
        this.tempAlbum = album;
        done();
      })
      .catch(done);
    });

    after( () => {
      delete exampleAlbum.userID;
    });

    it('SHOULD RETURN AN ALBUM', done => {
      request.get(`${url}/api/album/${this.tempAlbum._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if (err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleAlbum.name);
        expect(res.body.description).to.equal(exampleAlbum.description);
        expect(res.body.userID).to.equal(this.tempUser._id.toString());
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });
});
