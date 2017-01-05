'use strict';

const debug = require('debug')('cfgram:server-toggle');
const PORT = process.env.PORT;

module.exports = exports = {};

exports.serverOn = function(server, done){
  if(!server.isRunning){
    server.listen(PORT, err => {
      if(err) return done(err);
      server.isRunning = true;
      debug(`Server up: ${PORT}`);
      done();
    });
    return;
  }
  done();
};

exports.serverOff = function(server, done){
  if(server.isRunning){
    server.close(err => {
      if(err) return done(err);
      server.isRunning = false;
      debug('Server down');
      done();
    });
    return;
  }
  done();
};
