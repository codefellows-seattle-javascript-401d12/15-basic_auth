# Basic Auth API

## Overview

This is a basic app that allows a developer to POST and GET data via authorization/authentication that uses encryption modules.

## How do I use this app?

* Clone this repo and run the command `npm i` in your terminal to install all of the dependencies.

* You will also need to run the command `brew install httpie`. For this app, the requests used in the terminal are formatted via HTTPie CLI.

* Open 2 panes in your terminal to get started. You should see the type of requests and response status codes in both terminal panes.

* Be sure that you are in the root of the repo directory before attempting to initiate the port to the server. To do this, run `node server.js` in the first terminal pane.
  * `server running:` followed by your PORT number should be logged in the terminal

### POST requests
  * **i.e.** 200 OK request: `http POST :8000/api/signup username='user1' email='testemail@test.com' password='hey2434'`
    * You should receive a response with an encrypted token.
  * **i.e.** 400 BAD request: `http POST :8000/api/signup username='user1' password='hey2434'
` (no email is attached to POST request)
    * You should receive a response with a 'Bad Request' message.
    * The username, email and password fields are required.

### GET requests
  * **i.e.** 200 OK request: `http :8000/api/signin --auth user1:hey2434`
    * You must pass in the username and password for authentication separated by a colon.
    * You should receive a response with an encrypted token.
  * **i.e.** 401 Unauthorized request: `http :8000/api/signin --auth user1` (no password in this GET request)
    * You should receive a response with a 'Unauthorized' message.

POST and GET request commands should be run in the second terminal pane.
