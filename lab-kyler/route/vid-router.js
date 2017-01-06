const Express = require('express');
const AWS = require('aws-sdk');
const S3 = new AWS.S3();
const Upload = require('multer')({dest: `${__dirname}/../data`});
const HttpError = require('http-errors');
const Debug = require('debug')('kauth:vid-router');
const FS = require('fs');
const JsonParser = require('body-parser').json();

const AuthBearer = require('../lib/bearer-auth-middleware.js');
const Vid = require('../model/vid.js');

const vidRouter = module.exports = Express.Router();

vidRouter.post('/api/vid', AuthBearer, Upload.single('video'), function(req, res, next) {
  Debug('POST: /api/vid');

  if(!req.file) return next(HttpError(400, 'No file found'));
  if(!req.file.path) return next(HttpError(500, 'Failed to store file'));

  let fileExtension = req.file.originalname.split('.').pop();

  S3.upload({
    ACL: 'public-read',
    Bucket: process.env.AWS_BUCKET,
    Key: `${req.file.filename}.${fileExtension}`,
    Body: FS.createReadStream(req.file.path)
  }, (err, s3data) => {
    FS.unlink(req.file.path);
    if (err) return next(HttpError(500, 'AWS upload failed'));
    new Vid({
      name: req.header('name') || 'untitled video',
      desc: req.header('desc') || '',
      user_id: req.user._id,
      s3URI: s3data.Location,
      s3ObjectKey: s3data.Key
    })
    .save()
    .then( savedVid => {
      console.log('savedVid_id:', savedVid._id.toString());
      res.json(savedVid);
    })
    .catch( err => next(err));

  });
});

vidRouter.delete('/api/vid/:id', AuthBearer, JsonParser, function(req, res, next) {
  Debug('DELETE: /api/vid/:id');

  Vid.findById(req.params.id, (err, toBeRemovedVid) => {
    if(err) return next(HttpError(400, 'cannot find video with that ID'));

    S3.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: toBeRemovedVid.s3ObjectKey,
    }, (err, s3data) => {
      if(err) return next(HttpError(500, 'cannot delete S3 object'));
    });

    return toBeRemovedVid;
  })
  .remove();

  res.sendStatus(204);

});
