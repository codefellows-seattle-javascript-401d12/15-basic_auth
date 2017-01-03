![cf](https://i.imgur.com/7v5ASc8.png) Lab 15 - Basic Auth - Kyler Dotson
======

## Features
  * Users can sign up by POSTing desired credentials to /api/signup:
    * `http post localhost:<port>/api/signup username=<username> password=<password> email=<email>`
  * Users can sign in by GETing /api/signin with their credentials in an auth header:
    * `http get localhost:<port>/api/signin -a <username>:<password>`
  * User credentials are stored in a MongoDB at mlab.com
  * Passwords are 'hashed' before being stored
  * Port, MongoDB URI, and an app secret are stored in .env
  * Usernames and email address are checked for uniqueness upon signup

## How to use
  * `npm run start` to start service
  * `npm run test` to run automated tests
