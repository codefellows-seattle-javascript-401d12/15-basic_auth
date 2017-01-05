'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cfgram:photo-router');

const Photo = require('../model/photo.js');
const Album = require('../model/album.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const photoRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      // console.log(err);
      if(err) return reject(err);
      resolve(s3data);
    });
  });
}

photoRouter.post('/api/album/:albumID/photo', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST /api/album/:albumID/photo');

  if(!req.file) {
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

  Album.findById(req.params.albumID)
  .then( () => s3uploadProm(params))
  .then( s3data => {
    del([`${dataDir}/*`]);
    let photoData = {
      name: req.body.name,
      description: req.body.description,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: req.user._id,
      albumID: req.params.albumID
    };
    return new Photo(photoData).save();
  })
  .then( photo => res.json(photo))
  .catch( err => next(err));
});

photoRouter.delete('/api/album/:albumID/photo/:photoID', bearerAuth, function(req, res, next) {
  debug('DELETE /api/album/:albumID/photo/photoIDs');
  console.log('\n\n::: reached inside of photo router delete block\n\n');

  // if(!req.file) {
  //   return next(createError(400, 'file not found'));
  // }
  //
  // if (!req.file.path) {
  //   return next(createError(500, 'file not saved'));
  // }

  // delete from s3 Bucket

  // let ext = path.extname(req.file.originalname);

  // console.log('::: params are:', params);
  let params = {
    // ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: req.params.imageID
    // Body: fs.createReadStream(req.file.path)
  };

  s3.deleteObject(params);

  // delete from data folder
  // delete all data folder?
  // Photo.remove({});
  // delete from mongo?
  Photo.findByIdAndRemove(req.params.imageID)
  .then( () => res.status(204).send())
  .catch( err => next(createError(404, err.message)));
});
