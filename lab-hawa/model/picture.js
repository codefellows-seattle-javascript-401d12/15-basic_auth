'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pictureSchema = Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  created: {type: Date, default: Date.now},
  userID: {type: Schema.Types.ObjectId, required: true},
  galleryID: {type: Schema.Types.ObjectId, required: true},
  imageURI: {type: String, required: true, unique: true},
  objectKey: {type: String, required: true, unique: true},
});

module.exports = mongoose.model('picture', pictureSchema);
