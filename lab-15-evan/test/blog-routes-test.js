'use strict';

const expect = require('chai').expect;
const request = require('superagent');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const Member = require('../model/member.js');
const Blog = require('../model/blog.js');

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

mongoose.Promise = Promise;

describe('Blog Routes', function() {
  afterEach( done => {
    Promise.all([
      Member.remove({}),
      Blog.remove({})
    ])
    .then( () => done())
    .catch(done)
  });

  describe('POST: /api/blog', () => {
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

    it('should return a blog', done => {
      request.post(`${url}/api/blog`)
      .send(exampleBlog)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleBlog.name);
        expect(res.body.desc).to.equal(exampleBlog.desc);
        expect(res.body.memberID).to.equal(this.tempMember._id.toString());
        expect(date).to.not.equal('Invalid date');
        done();
      });
    });
  });

  describe('POST: /api/blog', () => {
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

    it('should respond with a 401', done => {
      request.post(`${url}/api/blog`)
      .send(exampleBlog)
      .end((err, res) => {
      expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('POST: /api/blog', () => {
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

    it('should respond with a 400', done => {
      request.post(`${url}/api/blog`)
      .send(null)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('GET: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should return a blog', done => {
      request.get(`${url}/api/blog/${this.tempBlog._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        if(err) return done(err);
        let date = new Date(res.body.created).toString();
        expect(res.body.name).to.equal(exampleBlog.name);
        expect(res.body.topic).to.equal(exampleBlog.topic);
        expect(res.body.desc).to.equal(exampleBlog.desc);
        expect(date).to.not.equal('Invalid Date');
        done();
      });
    });
  });

  describe('GET: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should respond with a 401', done => {
      request.get(`${url}/api/blog/${this.tempBlog._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  describe('GET: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should respond with a 404', done => {
      request.get(`${url}/api/blog/${this.tempBlog._id}/blog`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('PUT: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should return an updated blog', done => {
      let updatedBlog = {
        name: 'updatedBlogName',
        topic: 'updatedBlogTopic',
        desc: 'updatedBlogDescription'
      };
      request.put(`${url}/api/blog/${this.tempBlog._id}`)
      .send(updatedBlog)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {

        if(err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.name).to.equal('updatedBlogName');
        this.tempBlog = res.body;
        done();
      });
    });
  });

  describe('PUT: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should respond with a 401', done => {
      let updatedBlog = {
        name: 'updatedBlogName',
        topic: 'updatedBlogTopic',
        desc: 'updatedBlogDescription'
      };
      request.put(`${url}/api/blog/${this.tempBlog._id}`)
      .send(updatedBlog)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });
  });

  // describe('PUT: /api/blog/:id', () => {
  //   before( done => {
  //     new Member(exampleMember)
  //     .generatePasswordHash(exampleMember.password)
  //     .then( member => member.save())
  //     .then( member => {
  //       this.tempMember = member;
  //       return member.generateToken();
  //     })
  //     .then( token => {
  //       this.tempToken = token;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //
  //   before( done => {
  //     exampleBlog.memberID = this.tempMember._id.toString();
  //     new Blog(exampleBlog).save()
  //     .then( blog => {
  //       this.tempBlog = blog;
  //       done();
  //     })
  //     .catch(done);
  //   });
  //
  //   after( () => {
  //     delete exampleBlog.memberID;
  //   });
  //
  //   it('should respond with a 400', done => {
  //     request.put(`${url}/api/blog/${this.tempBlog._id}`)
  //     .send(null)
  //     .set({
  //       Authorization: `Bearer ${this.tempToken}`
  //     })
  //     .end((err, res) => {
  //       expect(res.status).to.equal(400);
  //       done();
  //     });
  //   });
  // });

  describe('PUT: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should respond with a 404', done => {
      let updatedBlog = {
        name: 'updatedBlogName',
        topic: 'updatedBlogTopic',
        desc: 'updatedBlogDescription'
      };
      request.put(`${url}/api/blog/${this.tempBlog._id}/9`)
      .send(null)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
  });

  describe('DELETE: /api/blog/:id', () => {
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

    after( () => {
      delete exampleBlog.memberID;
    });

    it('should respond with a 204', done => {
      request.delete(`${url}/api/blog/${this.tempBlog._id}`)
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .end((err, res) => {
        expect(res.status).to.equal(204);
        done();
      });
    });
  });
});
