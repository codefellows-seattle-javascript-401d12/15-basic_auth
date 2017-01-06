'use strict';

const Mongoose = require('mongoose');

module.exports = Mongoose.model('vid', Mongoose.Schema({
  name: {type: String, required: true},
  desc: {type: String, required: false},
  user_id: {type: Mongoose.Schema.Types.ObjectId, required: true},
  s3URI: {type: String, required: true, unique: true},
  s3ObjectKey: {type: String, required: true, unique: true},
  created: {type: Date, default: Date.now}
}));
