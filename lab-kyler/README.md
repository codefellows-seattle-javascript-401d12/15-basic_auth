![cf](https://i.imgur.com/7v5ASc8.png) Lab 16 - Token-based Authentication with jokes!
# Kyler Dotson
======

## Features
  * Users can sign up by POSTing desired credentials to /api/signup:
    * `http post localhost:<port>/api/signup username=<username> password=<password> email=<email>`
  * Users can sign in by GETing /api/signin with their credentials in an auth header:
    * `http get localhost:<port>/api/signin -a <username>:<password>`
  * Signed in users can store a joke and a "mature content" flag, with a POST to /api/joke:
    * `http post localhost:<port>/api/joke authorization='Bearer <auth token>' setup=<setup> punchline=<punchline> mature=<boolean>`
  * Signed in users can retrieve a joke with a GET to /api/joke:
    * `http get localhost:<port>/api/joke/<jokeID> authorization='Bearer <auth token>'`
  * Signed in users can update arbitrary joke properties (all are optional) with a PUT to /api/joke:
    * `http put localhost:<port>/api/joke/<jokeID> authorization='Bearer <auth token>' setup=<newsetup> punchline=<newpunchline> mature=<newboolean>`
  * Signed in users can delete their own jokes with a DELETE to /api/joke:
    * `http delete localhost:<port>/api/joke/<jokeID> authorization='Bearer <auth token>'`
  * User credentials are stored in a MongoDB at mlab.com
  * Passwords are 'hashed' before being stored
  * Port, MongoDB URI, and an app secret are stored in .env
  * Usernames and email address are checked for uniqueness upon signup

## How to use
  * `npm run start` to start service
  * `npm run test` to run automated tests
