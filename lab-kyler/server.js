'use strict';

const express = require('express');
//const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('kauth:server');

const kauthRouter = require('./route/kauth-router.js');
const jokeRouter = require('./route/joke-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT;

mongoose.Promise = Promise;

const app = express();
mongoose.connect(process.env.MONGODB_URI);

//app.use(cors());
app.use(morgan('dev'));
app.use(kauthRouter);
app.use(jokeRouter);
app.use(errors);

app.listen(PORT, () => {
  debug(`Server up on ${PORT}`);
});
