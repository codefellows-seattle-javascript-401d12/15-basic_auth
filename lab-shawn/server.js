'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');

const authRouter = require('./route/auth-router.js');
const galleryRouter = require('./route/gallery-router.js');
const errors = require('./lib/err-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(galleryRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Server up on ${PORT}`);
});
