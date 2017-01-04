'use strict';

const express = require('express');
const debug = require('debug')('fomogram:server');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT;
const app = express();

const errors = require('./lib/error-middleware.js');
const authRouter = require('./route/auth-router.js');
const galleryRouter = require('./route/gallery-router.js');

dotenv.load();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(galleryRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`server up: ${PORT}`);
});
