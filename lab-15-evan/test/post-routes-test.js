'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const debug = require('debug')('lab15:post-routes-test');

const Post = require('../model/post.js');
const Member = require('../model/member.js');
const Blog = require('../model/blog.js');

const serverToggle = require('./lib/server-toggle.js');
const server = require('../server.js');

const url = `http://localhost:${process.env.PORT}`;

const exampleMember = {
  username: 'examplename',
  password: '12345678',
  email: 'examplemember@mailtest.com'
};

const exampleBlog = {
  name: 'exampleBlogName',
  topic: 'someExampleTopic',
  desc: 'someBlogDescription'
};

const examplePost = {
  name: 'example post',
  desc: 'example post description',
  image: `${__dirname}/data/tester.png`
};

describe('Post Routes', function() {
  before( done => {
    serverToggle.serverOn(server, done);
  });

  after( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      Post.remove({}),
      Member.remove({}),
      Blog.remove({})
    ])
    .then( () => done())
    .catch(done);
  });

  describe('POST: /api/blog/:id/post', function() {
    describe('with a valid token and data', function() {
      before( done => {
        new Member(exampleMember)
        .generatePasswordHash(exampleMember.password)
        .then( member => member.save())
        .then( member => {
          this.tempMember = member;
          return member.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        exampleBlog.memberID = this.tempMember._id.toString();
        new Blog(exampleBlog).save()
        .then( blog => {
          this.tempBlog = blog;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleBlog.memberID;
        done();
      });

      it('should return a post', done => {
        request.post(`${url}/api/blog/${this.tempBlog._id}/post`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .field('name', examplePost.name)
        .field('desc', examplePost.desc)
        .attach('image', examplePost.image)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.name).to.equal(examplePost.name);
          expect(res.body.desc).to.equal(examplePost.desc);
          expect(res.body.blogID).to.equal(this.tempBlog._id.toString());
          done();
        });
      })
      .timeout(6000);
    });
  });

  describe('DELETE: /api/post/:id', function() {
    describe('with a valid token and data', function() {
      before( done => {
        new Member(exampleMember)
        .generatePasswordHash(exampleMember.password)
        .then( member => member.save())
        .then( member => {
          this.tempMember = member;
          return member.generateToken();
        })
        .then( token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
      });

      before( done => {
        exampleBlog.memberID = this.tempMember._id.toString();
        new Blog(exampleBlog).save()
        .then( blog => {
          this.tempBlog = blog;
          done();
        })
        .catch(done);
      });

      before( done => {
        new Post(examplePost).save()
        .then( post => {
          this.tempPost = post;
          done();
        })
        .catch(done);
      });

      after( done => {
        delete exampleBlog.memberID;
        done();
      });

      it('should respond with a 204', done => {
        request.delete(`${url}/api/post/${this.tempPost._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`
        })
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
      })
      .timeout(6000);
    });
  });
});
