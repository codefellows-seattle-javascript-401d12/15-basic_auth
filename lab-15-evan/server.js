'use strict';

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const debug = require('debug')('lab15:server');

const postRouter = require('./routes/post-router.js');
const authRouter = require('./routes/auth-router.js');
const blogRouter = require('./routes/blog-router.js');
const errors = require('./lib/error-middleware.js');

dotenv.load();

const PORT = process.env.PORT || 8000;
const app = express();

mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(morgan('dev'));

app.use(postRouter);
app.use(authRouter);
app.use(blogRouter);
app.use(errors);

const server = module.exports = app.listen(PORT, () => {
  debug(`Server running on ${PORT}`);
});

server.isRunning = true;
