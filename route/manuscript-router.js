'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cfgram:manuscript-router');

const Manuscript = require('../model/manuscript.js');
const Publisher = require('../model/publisher.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});

const manuscriptRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if (err) return reject(err);
      resolve(s3data);
    });
  });
}

manuscriptRouter.post('/api/publisher/:publisherID/manuscript', bearerAuth, upload.single('doc'), function(req, res, next) {
  debug('POST: /api/publisher/:publisherID/manuscript');

  if (!req.file) {
    return next(createError(401, 'file not found'));
  }

  if (!req.file.path) {
    return next(createError(500, 'file not saved'));
  }

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };

  Publisher.findById(req.params.publisherID)
  .then(() => s3uploadProm(params))
  .then(s3data => {
    del([`${dataDir}/*`]);
    let manuscriptData = {
      name: req.body.name,
      desc: req.body.desc,
      objectKey: s3data.Key,
      docURI: s3data.Location,
      userID: req.user._id,
      publisherID: req.params.publisherID
    };
    return new Manuscript(manuscriptData).save();
  })
  .then(manuscript => res.json(manuscript))
  .catch(err => next(err));
});

manuscriptRouter.delete('/api/publisher/:publisherID/manuscript/:manuscriptID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/publisher/:publisherID/manuscript/:manuscriptID');

  let ext = path.extname(req.file.originalname);

  let params = {
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
  };

  Manuscript.findByIdAndRemove(req.params.manuscriptID)
  .then(() => s3.deleteObject(params))
  .then(() => res.status(204).send())
  .catch(err => next(err));
});
