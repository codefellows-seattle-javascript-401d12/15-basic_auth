'use strict';

const User = require('../../model/user.js');
const Gallery = require('../../model/gallery.js');
const Pic = require('../../model/pic.js');
const testData = require('./test-data.js');
const debug = require('debug')('cfgram:test-helper.js');

module.exports = exports = {};

exports.databaseCleanUp = function(done){
  Promise.all([
    Pic.remove({}),
    User.remove({}),
    Gallery.remove({})
  ])
  .then(() => done())
  .catch(done);
};

exports.createUserAndToken = function(done){
  new User(testData.exampleUser)
  .generatePasswordHash(testData.exampleUser.password)
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
};

exports.createGallery = function(done){
  testData.exampleGallery.userID = this.tempUser._id.toString();
  new Gallery(testData.exampleGallery).save()
  .then(gallery =>{
    this.tempGallery = gallery;
    done();
  })
  .catch(done);
};

exports.deleteID = function(done){
  delete testData.exampleGallery.userID;
  done();
};
