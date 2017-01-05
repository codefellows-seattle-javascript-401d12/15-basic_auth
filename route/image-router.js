'use strict';

const debug = require('debug')('debug:image-router');
const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const Router = require('express').Router;
const multer = require('multer');
const createError = require('http-errors');

const Image = require('../model/image.js');
const Gallery = require('../model/gallery.js');
const bearer = require('../lib/bearer-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const images = `${__dirname}/../images`;
const upload = multer({ dest: images });

const imageRouter = module.exports = Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      if(err) return reject(err);
      resolve(s3data);
    });
  });
}

imageRouter.post('/api/gallery/:galleryID/image', bearer, upload.single('image'), function(req, res, next) {
  if(!req.file) {
    debug('!req.file');
    return next(createError(400, 'no file found'));
  }
  if(!req.file.path) return next(createError(500, 'file not saved'));

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };

  Gallery.findById(req.params.galleryID)
    .then( () => s3uploadProm(params))
    .then( s3data => {
      del([`${images}/*`]);
      let imageData = {
        name: req.body.name,
        description: req.body.description,
        objectKey: s3data.Key,
        imageURI: s3data.Location,
        userID: req.user._id,
        galleryID: req.params.galleryID
      };
      return new Image(imageData).save();
    })
    .then( image => res.json(image))
    .catch(next);
});

imageRouter.delete('/api/gallery/:galleryID/image/:imageID', bearer, function(req, res, next) {
  debugger;
  // let params = {
  //   Bucket: process.env.AWS_BUCKET,
  //   Key: req.params.imageID
  // };

  Gallery.findById(req.params.galleryID)
    .then( gallery => {
      console.log(gallery);
    });
    // .then( () => {
    //   s3.deleteObject(params);
    // })
    // .then( () => Gallery.findByIdAndRemove(req.params.id))
    // .then( () => res.status(200).send())
    // .catch( err => next(createError(404, err.message)));
});
