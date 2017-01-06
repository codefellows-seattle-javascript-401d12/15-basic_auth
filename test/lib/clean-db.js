'use strict';

const debug = require('debug')('mnp:clean-db');
const User = require('../../model/user.js');
const Game = require('../../model/game.js');
const Pic = require('../../model/pic.js');
const Promise = require('bluebird');

//NOTE: We are not connecting to mongoose here
//      because it's assumed that the server will
//      be running.

module.exports = function() {
  debug('working...');

  return Promise.all([
    User.remove({}),
    Game.remove({}),
    Pic.remove({})
  ]);
};
