'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
  name: {},
  desc: {},
  memberID: {},
  blogID: {},
  imageURI: {},
  objectKey: {},
  created: {}
});

module.exports = mongoose.model('post', postSchema);
