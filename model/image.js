'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  userID: { type: Schema.Types.ObjectId, required: true },
  galleryID: { type: Schema.Types.ObjectId, required: true },
  imageURI: { type: String, required: true, unique: true },
  objectKey: { type: String, required: true, unqiue: true },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('image', imageSchema);
