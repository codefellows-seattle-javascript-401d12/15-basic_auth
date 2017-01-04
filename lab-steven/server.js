'use strict';

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const errors = require('./lib/error-middleware.js');
const authRoute = require('./route/auth-route.js');
const studentRoute = require('./route/student-route.js');
const debug = require('debug')('photogram:server');
const app = express();

dotenv.load();

app.use(cors());
app.use(morgan('dev'));
app.use(authRoute);
app.use(studentRoute);
app.use(errors);

mongoose.connect(process.env.MONGODB_URI);

app.listen(process.env.PORT, function() {
  debug(`Server started on port ${process.env.PORT}`);
});
