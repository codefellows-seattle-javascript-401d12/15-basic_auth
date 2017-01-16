'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('cfgram:server');

const manuscriptRouter = require('./route/manuscript-router.js');
const authRouter = require('./route/auth-router.js');
const publisherRouter = require('./route/publisher-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(manuscriptRouter);
app.use(authRouter);
app.use(publisherRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server running: ${PORT}`);
});

server.isRunning = true;
