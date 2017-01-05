'use strict';

const debug = require('debug')('fomogram:server-controller');

module.exports = exports = {};

exports.serverOpen = function(server, done) {
  if(!server.isRunning) {
    server.listen(process.env.PORT, () => {
      server.isRunning = true;
      debug(`SERVER IS OPEN: ${process.env.PORT}`);
      done();
    });
    return;
  }
  done();
};

exports.serverClose = function(server, done) {
  if(server.isRunning) {
    server.close( err => {
      if(err) return done(err);
      server.isRunning = false;
      debug('SERVER IS CLOSED');
      done();
    });
    return;
  }
  done();
};
