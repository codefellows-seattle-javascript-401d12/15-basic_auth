'use strict';
const debug = require('debug')('fomogram:after-controller');
const User = require('../../model/user.js');
const Gallery = require('../../model/gallery.js');
const Image = require('../../model/image.js');
const mockData = require('./mockData.js');

module.exports = exports = {};

exports.removeUser = function(done) {
  User.remove({})
    .then( () => done())
    .catch(done);
};

exports.removeGalleryAndUser = function(done) {
  Promise.all([
    Gallery.remove({}),
    User.remove({})
  ])
  .then( () => done())
  .catch(done);
};

exports.removeGalleryUserAndImage = function(done) {
  Promise.all([
    Image.remove({}),
    User.remove({}),
    Gallery.remove({})
  ])
  .then( () => done())
  .catch(done);
};

exports.deleteTestGalleryUserId = function(done) {
  delete mockData.testGallery.userID;
  done();
};
