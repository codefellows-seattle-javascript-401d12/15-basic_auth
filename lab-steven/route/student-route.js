'use strict';

const Router = require('express').Router;
const debug = require('debug')('photogram:student route');
const createError = require('http-errors');
const parseJSON = require('body-parser').json();
const bearAuth = require('../lib/bearer-auth-middleware.js');
const Student = require('../model/student.js');
const studentRouter = module.exports = Router();

studentRouter.post('/api/student', bearAuth, parseJSON, function(request, response, next) {
  debug('POST: /api/student');

  request.body.userID = request.user._id;
  new Student(request.body).save()
  .then(student => response.json(student))
  .catch(next);
});

studentRouter.get('/api/student', bearAuth, function(request, response, next) {
  debug('GET: /api/student');

  Student.find()
  .then(arrayOfStudents => response.send(arrayOfStudents.map(student => student._id)))
  .catch(next);
});

studentRouter.get('/api/student/:id', bearAuth, function(request, response, next) {
  debug('GET: /api/student/:id');

  Student.findById(request.params.id)
  .then(student => {
    if (student.userID.toString() !== request.user._id.toString()) return next(createError(401, 'Wrong user'));
    response.json(student);
  })
  .catch(next);
});

studentRouter.put('/api/student/:id', bearAuth, parseJSON, function(request, response, next) {
  debug('PUT: /api/student/:id');

  if (Object.keys(request.body).length < 1) {
    response.status(400).send('No updated content passed in');
    return;
  }

  Student.findByIdAndUpdate(request.params.id, request.body, {new: true})
  .then(student => {
    if (student.userID.toString() !== request.user._id.toString()) return next(createError(401, 'Wrong user'));
    response.json(student);
  })
  .catch(next);
});
