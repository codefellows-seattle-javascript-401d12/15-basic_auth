'use strict';
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:albumSchema');

const Schema = mongoose.Schema;

const albumSchema = Schema({
  name: {type: String, required: true},
  desc: {type: String, required: true},
  created: { type: Date, required: true, default: Date.now},
  userID: { type: mongoose.Schema.Types.ObjectId, required:true}
});

module.exports = mongoose.model('album', albumSchema);
