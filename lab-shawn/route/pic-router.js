'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('cfgram:pic-router');

const Pic = require('../model/pic.js');
const Gallery = require('../model/gallery.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({dest: dataDir});

const picRouter = module.exports = Router();

function s3uploadProm(params){
  return new Promise((resolve, reject) => {
    s3.upload(params,(err,s3data) => {
      if(err) return reject(err);
      resolve(s3data);
    });
  });
}

picRouter.post('/api/gallery/:galleryID/pic', bearerAuth, upload.single('image'), function(req,res,next){
  debug('POST: /api/gallery/:gallerID/pic');

  if(!req.file) return next(createError(400,'file not found'));
  if(!req.file.path) return next(createError(500,'file not saved'));

  let ext = path.extname(req.file.originalname);
  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path),
  };

  Gallery.findById(req.params.galleryID)
  .then( () => s3uploadProm(params))
  .then(s3data => {
    del([`${dataDir}/*`]);
    let picData = {
      name: req.body.name,
      desc: req.body.desc,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      userID: req.user._id,
      galleryID: req.params.galleryID
    };
    console.log('aaaaaaaaaa', s3data);
    return new Pic(picData).save();
  })
 .then(pic => res.json(pic))
 .catch(err => next(err));
});

picRouter.delete('/api/gallery/:galleryID/pic/:picID', bearerAuth, function(req,res,next){
  debug('DELETE: /api/gallery/:galleryID/pic/:picID');

  Gallery.findById(req.params.galleryID)
  .then(gallery => Pic.findById(req.params.picID))
  .then(pic => {
    // if(!req.file) return next(createError(400,'file not found'));
    // let ext = path.extname(req.file.originalname);
    let params = {
      Bucket: process.env.AWS_BUCKET,
      Key: pic.Location
    }
    // console.log('aaaaaaaaaaaaaa',pic);
    s3.deleteObject(params, err => {
      if(err) return next(createError(404,'item not deleted'));
    });

    Pic.remove(pic,err => {
      if(err) return next(createError(404, 'item not removed from DB'));
      console.log('removal successful');
    });
  })
  .then(() => res.status(204).send())
  .catch(err => next(createError(404,err.message)));
});
