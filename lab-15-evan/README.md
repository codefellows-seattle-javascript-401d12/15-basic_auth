# Lab 15 Basic Authorization

## About
  This is an API, built utilizing ExpressJs and  MongoDB. The API is a work in progress built for the purpose of furthering an understanding of building a full CRUD RESTful API, with authorization and authentication. Bearer authentication is used to validate users when attempting to GET, POST, PUT or DELETE.

  #### Model Types
  ##### Member
    - Username for  member
    - Password for member
    - Email for member
    - findHash for member

  ##### Blog
    - Name for blog
    - Topic for blog
    - Desc(description) of blog

  #### Post
    - Name for post
    - desc(description) for post

#### Recent Additions
  Users may now POST, or DELETE images with the proper credentials
  AWS(Amazon Web Services) S3 is utilized to host the images. Each image added to S3 and the reference to the image is held in the database that was previously established.

## Getting Started
### To get started clone this repository
  - Clone this repository
  - run `npm i`
  - check that your dependencies were installed
  - to start the server, run `node server.js`
  - download [HTTPIE](http://httpie.org)
