'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const manuscriptSchema = Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  userID: {type: Schema.Types.ObjectId, required: true},
  publisherID: {type: Schema.Types.ObjectId, required: true},
  docURI: {type: String, required: true, unique: true},
  objectKey: {type: String, required: true, unique: true},
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('manuscript', manuscriptSchema);
