'use strict';

const cors = require('cors');
const debug = require('debug')('picgram:server');
const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRouter = require('./route/auth-router.js');
const photobookRouter = require('./route/photobook-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(authRouter);
app.use(photobookRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Server is up: ${PORT}`);
});
