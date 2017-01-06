'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('picgram:pic-router');

const Pic = require('../model/pic.js');
const Photobook = require('../model/photobook.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const picRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if (err) return reject(err);
      resolve(s3data);
    });
  });
}

picRouter.post('/api/photobook/:photobookID/pic', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST: /api/photobook/:photobookID/pic');

  if (!req.file) {
    return next(createError(400, 'file not found'));
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

  Photobook.findById(req.params.photobookID)
  .then( () => s3uploadProm(params))
  .then( s3data => {
    del([`${dataDir}/*`]);
    let picData = {
      name: req.body.name,
      desc: req.body.desc,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: req.user._id,
      photobookID: req.params.photobookID
    };
    return new Pic(picData).save();
  })
  .then( pic => res.json(pic))
  .catch( err => next(err));
});

picRouter.delete('/api/photobook/:photobookID/pic/:picID', bearerAuth, function(req, res, next) {
  debug('DELETE /api/photobook/:photobookID/pic/picIDs');

  let params = {
    Bucket: process.env.AWS_BUCKET,
    Key: req.params.imageID
  };

  s3.deleteObject(params);

  Photobook.findByIdAndRemove(req.params.imageID)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
