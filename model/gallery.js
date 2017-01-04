'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gallerySchema = Schema({
  name: { type: String, required: true },
  description: { type: String },
  dateCreated: { type: Date, required: true, default: Date.now},
  userID: { type: Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('gallery', gallerySchema);
