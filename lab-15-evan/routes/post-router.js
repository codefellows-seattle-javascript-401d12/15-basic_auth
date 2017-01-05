'use strict';

const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const createError = require('http-errors');
const debug = require('debug')('lab15:post-router');

const Post = require('../model/post.js');
const Blog = require('../model/blog.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

AWS.config.setPromisesDependency(require('bluebird'));

const s3 = new AWS.S3();
const dataDir = `${__dirname}/../data`;
const upload = multer({ dest: dataDir });

const postRouter = module.exports = new Router();

function s3uploadProm(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, s3data) => {
      resolve(s3data);
    });
  });
}

postRouter.post('/api/blog/:blogID/post', bearerAuth, jsonParser, upload.single('image'), function(req, res, next) {
  debug('POST /api/blog/:blogID/post');

  if(!req.file) {
    return next(createError(400, 'No file provided'));
  }

  if(!req.file.path) {
    return next(createError(500, 'File not saved'));
  }

  let ext = path.extname(req.file.originalname);

  let params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}${ext}`,
    Body: fs.createReadStream(req.file.path)
  };

  Blog.findById(req.params.blogID)
  .then( () => s3uploadProm(params))
  .then( s3data => {
    del([`${dataDir}/*`]);
    let postData = {
      name: req.body.name,
      desc: req.body.desc,
      objectKey: s3data.Key,
      imageURI: s3data.Location,
      memberID: req.member._id,
      blogID: req.params.blogID
    }
    return new Post(postData).save();
  })
  .then( post => res.json(post))
  .catch( err => next(err));
});
