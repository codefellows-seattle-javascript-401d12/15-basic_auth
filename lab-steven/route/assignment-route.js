'use strict';

const Router = require('express').Router;
const createError = require('http-errors');
const fs = require('fs');
const path = require('path');
const del = require('del');
const AWS = require('aws-sdk');
const multer = require('multer');
const parseJSON = require('body-parser').json();
const bearAuth = require('../lib/bearer-auth-middleware.js');
const Student = require('../model/student.js');
const s3 = new ASW.S3();
const upload = multer({dest: `${__dirname}/../data`});

AWS.config.setPromisesDependency(require('bluebird'));

const assignmentRouter = module.exports = Router();
