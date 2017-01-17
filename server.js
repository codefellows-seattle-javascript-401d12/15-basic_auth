'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('cfgram:server');

const authRouter = require('./route/auth-router.js');
const vaultRouter = require('./route/vault-router.js');
const imageRouter = require('./route/image-router.js');
const errors = require('./lib/error-middleware');

dotenv.load();

const PORT = process.env.PORT;
const app = express();


mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(vaultRouter);
app.use(imageRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server up on ${PORT}`);
});

server.isRunning = true;
