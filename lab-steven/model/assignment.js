'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = Schema({
  name: {type: String, required: true},
  details: {type: String, required: true},
  studentID: {type: Schema.Types.ObjectId, required: true},
  userID: {type: Schema.Types.ObjectId, required: true},
  textURI: {type: String, required: true, unique: true},
  objectKey: {type: String, required:true, unique: true}
});

module.exports = mongoose.model('assignment', assignmentSchema);
