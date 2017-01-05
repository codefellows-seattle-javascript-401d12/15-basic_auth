'use strict';

const debug = require('debug')('fomogram:before-controller');
const User = require('../../model/user.js');
const Gallery = require('../../model/gallery.js');
const mockData = require('./mockData.js');

module.exports = exports = {};

exports.createUser = function(done) {
  let user = new User(mockData.testUser);
  user.genPasswordHash(mockData.testUser.password)
  .then( user => user.save())
  .then( user => {
    this.tempUser = user;
    done();
  })
  .catch(done);
};

exports.createUserWithToken = function(done) {
  new User(mockData.testUser)
  .genPasswordHash(mockData.testUser.password)
  .then( user =>  user.save())
  .then( user => {
    this.tempUser = user;
    return user.genToken();
  })
  .then( token => {
    this.tempToken = token;
    done();
  })
  .catch(done);
};

exports.createGallery = function(done) {
  mockData.testGallery.userID = this.tempUser._id.toString();
  new Gallery(mockData.testGallery).save()
  .then( gallery => {
    this.tempGallery = gallery;
    done();
  })
  .catch(done);
};
