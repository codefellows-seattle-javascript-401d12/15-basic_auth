'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cfgram:image-router');

const Image = require('../model/image.js');
const Vault = require('../model/vault.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir});

const imageRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {

    s3.upload(params, (err, s3data) => {
      if (err) return reject (err);
      resolve(s3data);
    });
  });
}

imageRouter.post('/api/vault/:vaultID/image', bearerAuth, upload.single('image'), function(req, res, next) {
  debug('POST: /api/vault/:vaultID/image');

  if(!req.file) {
    return next(createError(400, 'file not found'));
  }

  if(!req.file.path) {
    return next(createError(500, 'file not saved'));
  }

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };

  Vault.findById(req.params.vaultID)
  .then( () => s3uploadProm(params))
  .then( s3data => {
    del([`${dataDir}/*`]);
    let imageData = {
      name: req.body.name,
      desc: req.body.desc,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: req.user._id,
      vaultID: req.params.vaultID
    };
    return new Image(imageData).save();
  })
  .then( image => res.json(image))
  .catch( err => next(err));

});

imageRouter.delete('/api/vault/:vaultID/image/imageID', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/image/:imageID');

  Image.findById(req.params.imageID)
  .then(image => {

    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: image.objectKey
    };
    s3.deleteObject(params, (err) => {
      if (err) return next(err);
      Image.findByIdAndRemove(req.params.imageID)
      .then(() => res.status(204).send())
      .catch(next);
    });
  })
  .catch(err => next(createError(404, err.message)));


});
