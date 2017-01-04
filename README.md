# Basic User Auth API

This API uses basic authentication to create a username, password, and e-mail for a user that can be sent through HTTP headers. This API uses two resources to let the user sign-in and sign-up.

### Set-Up

In your Terminal

```sh
$ git clone <repository url>
$ cd 15-basic_auth
$ npm i
```
This will install the proper dependencies. You should receive the following in your package.json file:

```sh
"dependencies": {
  "bcrypt": "^1.0.2",
  "bluebird": "^3.4.7",
  "body-parser": "^1.15.2",
  "cors": "^2.8.1",
  "debug": "^2.6.0",
  "dotenv": "^2.0.0",
  "express": "^4.14.0",
  "http-errors": "^1.5.1",
  "jsonwebtoken": "^7.2.1",
  "mongoose": "^4.7.5",
  "morgan": "^1.7.0"
  "chai": "^3.5.0",
  "mocha": "^3.2.0",
  "superagent": "^3.3.1"
}
```

### Use

You will need to have 3 terminal shells open to use this application.

* In one shell, run `mongod` to start the database.
* In another shell, run `npm run start`. You will receive a response of 'server live on PORT: `<PORT>`'
* The last shell will be used to make GET, and POST requests

Making a POST request
* Run `http POST localhost:<PORT>/api/signup username='<name>'
password='<password>' email='<email>'`
* A successful response will return the associated token.
* You will also receive a status code of 200.

Making a GET request
* Run `http localhost:<PORT>/api/signin --auth <username>:<password>`
* A successful response will return the associated token.
* You will also receive a status code of 200.
