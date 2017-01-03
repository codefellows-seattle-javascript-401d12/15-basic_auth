'use strict';

const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const debug = require('debug')('cfgram:server');


const PORT = process.env.PORT;
const app = express();

dotenv.load();

mongoose.connect(process.env.MONGODB_URI);

app.listen(PORT, () => {
  console.log(`server up on ${PORT}`);
});
