'use strict';

const debug = require('debug')('mnp:game-route-test');
const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');
mongoose.Promise = Promise;

const User = require('../model/user.js');
const Game = require('../model/game.js');

require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

function makePlayer(data) {
  let player = {};
  return new User(data)
  .generatePasswordHash(data.password)
  .then( user => user.save())
  .then( user => {
    player.user = user;
    return user.generateToken();
  })
  .then( token => {
    player.token = token;
    return player;
  });
}

describe('Game Routes', function() {
  before( done => {
    let tasks = [];
    this.players = [];
    for(let i = 1; i < 5; i++) {
      tasks.push(
        makePlayer({
          username: `user_${i}`,
          email: `user_${i}@example.com`,
          password: `password_${i}`
        })
      );
    }
    Promise.all(tasks)
    .then( pArr => {
      pArr.forEach( player => this.players.push(player));
      debug('finished making mock players');
      done();
    })
    .catch( err => {
      console.log(err);
      done();
    });
  });

  afterEach( () => Game.remove({}));
  after( () => {
    debug('cleanup users');
    User.remove({});
  });

  describe('POST /api/game', () => {
    describe('with a valid body and token', () => {
      it('should return a game', done => {
        let player = this.players[0];
        request.post(`${url}/api/game`)
        .send({ type: 'singles' })
        .set({
          Authorization: `Bearer ${player.token}`
        })
        .end( (err, res) => {
          // console.log(res.body);
          let date = new Date(res.body.created).toString();
          expect(date).to.not.equal('Invalid Date');
          expect(res.body.userId).to.equal(player.user._id.toString());
          expect(res.body.players[0]).to.equal(player.user._id.toString());
          done();
        });
      });
    }); // valid body and token

    describe('with a missing token', () => {
      it('should return a 401', done => {
        request.post(`${url}/api/game`)
        .send({ type: 'singles' })
        .end( (err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    }); // missing token

    describe('with a missing body', () => {
      it('should return a 400', done => {
        let player = this.players[0];
        request.post(`${url}/api/game`)
        .set({
          Authorization: `Bearer ${player.token}`
        })
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); // missing body

    describe('with an invalid body', () => {
      it('should return a 400', done => {
        let player = this.players[0];
        request.post(`${url}/api/game`)
        .send({ animal: 'monkey' })
        .set({
          Authorization: `Bearer ${player.token}`
        })
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
      });
    }); // missing body

  }); // POST /api/game

  describe('GET /api/game/:id', () => {
    before( done => {
      new Game({
        userId: this.players[0].user._id,
        type: 'singles',
        players: [ this.players[0].user._id ]
      }).save()
      .then( game => {
        this.singlesGame = game;
        done();
      })
      .catch(done);
    });
    describe('with a valid id', () => {
      it('should return the game', done => {
        request.get(`${url}/api/game/${this.singlesGame._id}`)
        .set({
          Authorization: `Bearer ${this.players[0].token}`
        })
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.type).to.equal(this.singlesGame.type);
          expect(res.body.players).to.have.length(1);
          done();
        });
      });
    }); // valid id

    describe('with no token', () => {
      it('should return a 401', done => {
        request.get(`${url}/api/game/${this.singlesGame._id}`)
        .end( (err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    }); // no token

    describe('with an invalid id', () => {
      it('should return a 404', done => {
        let player = this.players[0];
        request.get(`${url}/api/game/abcdef`)
        .set({
          Authorization: `Bearer ${player.token}`
        })
        .end( (err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
      });
    }); // invalid id
  }); // GET /api/game/:id

  describe('PUT /api/game/:id/join', () => {
    before( done => {
      new Game({
        userId: this.players[0].user._id,
        type: 'singles',
        players: [ this.players[0].user._id ]
      }).save()
      .then( game => {
        this.singlesGame = game;
        done();
      })
      .catch(done);
    });
    describe('with a valid id and token', () => {
      it('should add the user to the game', done => {
        request.put(`${url}/api/game/${this.singlesGame._id}/join`)
        .set({
          Authorization: `Bearer ${this.players[1].token}`
        })
        .end( (err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.players).to.have.length(2);
          expect(res.body.players[1]).to.equal(this.players[1].user._id.toString());
          done();
        });
      });
    }); // valid id and token

    describe('with a missing token', () => {
      it('should return a 401', done => {
        request.put(`${url}/api/game/${this.singlesGame._id}/join`)
        .end( (err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
      });
    }); // missing token

  }); // PUT /api/game/:id/join
});





























//
