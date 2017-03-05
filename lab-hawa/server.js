'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
// const Promise = require('bluebird');
const debug = require('debug')('cfgram:server.js');

const pictureRouter = require('./route/picture-router.js');
const galleryRouter = require('./route/gallery-router.js');
const userRouter = require('./route/user-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(pictureRouter);
app.use(galleryRouter);
app.use(userRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug('server up:', PORT);
});

server.isRunning = true;
