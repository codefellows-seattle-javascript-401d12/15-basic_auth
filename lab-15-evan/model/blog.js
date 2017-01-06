'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = Schema({
  name: { type: String, required: true },
  topic: { type: String, required: true },
  desc: { type: String, required: true },
  created: { type: Date, required: true, default: Date.now },
  memberID: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('blog', blogSchema);
