'use strict';

const debug = require('debug')('photogram:server switch');

module.exports = exports = {};

exports.startServer = function(server, done) {
  if (!server.on) {
    server.listen(process.env.PORT, () => {
      debug(`Server running on port ${process.env.PORT}.`);
      server.on = true;
      done();
    });
    return;
  }
  done();
};

exports.stopServer = function(server, done) {
  if (server.on) {
    server.close(err => {
      if (err) return done(err);
      debug('Server stopped.');
      server.on = false;
      done();
    });
    return;
  }
  done();
};
