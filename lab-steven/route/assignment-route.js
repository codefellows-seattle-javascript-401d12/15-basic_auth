'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const fs = require('fs');
const path = require('path');
const del = require('del');
const debug = require('debug')('photogram:assignment routes');
const AWS = require('aws-sdk');
const multer = require('multer');
const bearAuth = require('../lib/bearer-auth-middleware.js');
const Student = require('../model/student.js');
const Assignment = require('../model/assignment.js');
const s3 = new AWS.S3();
const upload = multer({dest: `${__dirname}/../data`});

AWS.config.setPromisesDependency(require('bluebird'));

const assignmentRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

function s3fetchProm(params) {
  return new Promise((resolve, reject) => {
    s3.getObject(params, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

assignmentRouter.post('/api/student/:studentID/assignment', bearAuth, upload.single('text assignment'), function(request, response, next) {
  debug('POST: /api/student/:studentID/assignment');

  if (!request.file) return next(createError(400, 'No file provided'));
  if (!request.file.path) return next(createError(500, 'File not saved.'));
  let ext = path.extname(request.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${request.file.filename}${ext}`,
    Body: fs.createReadStream(request.file.path)
  };

  Student.findById(request.params.studentID)
  .then(() => s3uploadProm(params))
  .then(response => {
    del([`${__dirname}/../data/*`]);
    let assignmentText = {
      name: request.body.name,
      details: request.body.details,
      objectKey: response.Key,
      textURI: response.Location,
      userID: request.user._id,
      studentID: request.params.studentID
    };
    return new Assignment(assignmentText).save();
  })
  .then(assignment => response.json(assignment))
  .catch(err => next(err));
});
