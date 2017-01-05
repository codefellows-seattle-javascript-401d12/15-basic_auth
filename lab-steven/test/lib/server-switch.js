'use strict';

const debug = require('debug')('photogram:server switch');

module.exports = exports = {};

exports.startServer = function(server, done) {
  if (!server.running) {
    server.listen(process.env.PORT, () => {
      debug(`Server running on port ${process.env.PORT}.`);
      server.running = true;
      done();
    });
    return;
  }
  done();
};

exports.stopServer = function(server, done) {
  if (server.running) {
    server.close(err => {
      if (err) return done(err);
      debug('Server stopped.');
      server.running = false;
      done();
    });
    return;
  }
  done();
};
