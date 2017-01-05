'use strict';

const express = require('express');
const debug = require('debug')('fomogram:server');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

const errors = require('./lib/error-middleware.js');
const authRouter = require('./route/auth-router.js');
const galleryRouter = require('./route/gallery-router.js');
const imageRouter = require('./route/image-router.js');

dotenv.load();

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(galleryRouter);
app.use(imageRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});

server.isRunning = true;
