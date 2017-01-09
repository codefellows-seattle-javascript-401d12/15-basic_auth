'use strict';

const Mongoose = require('mongoose');

module.exports = Mongoose.model('joke', Mongoose.Schema({

  setup: {type: String, required: false},
  punchline: {type: String, required: true},
  mature: {type: Boolean, required: true},
  user_id: {type: Mongoose.Schema.Types.ObjectId, required: true}

}));
