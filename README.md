# Basic Auth API Using MongoDB and Express

This project creates a user and authenticates user using [Express.js](http://expressjs.com/) and [MongoDB](https://docs.mongodb.com/). Users send a POST request to create user and GET request to authenticate sign in through the terminal.
When sending POST requests, use filepath `/api/signup`.
When sending GET requests, use filepath `/api/signin`.
You will need [HTTPie](https://httpie.org/) to send requests through the terminal.

## How to run

Install any Dependencies from the `package.json` file into the project root
directory. Using [Node.js](https://nodejs.org/), to create a `package.json` file, enter command `npm init` in the project root.
You can run the command `npm i` to install all dependencies.

## Running server

Run the `server.js` file using command `node server.js` or `npm run start`. In terminal, you should see `Server up: 8000` or
port that is set in your environmental variable in terminal.

## Sending POST and GET Request

###POST Request

>Create User POST Request

In an new terminal window, send a `POST` request by using the command
`http POST localhost:8000/api/signup username=<name> password=<password> email=<email>`.
Example: `http POST localhost:8000/api/signup username='John' password='1234' email='john@email.com'`
The successful response should return a hash string value along with a status code of `200`.

###GET Request

>User Sign In GET Request

In an new terminal window, send a `GET` request by using the command `http localhost:8000/api/signin --auth <username>:<password>`.
Example: `http localhost:8000/api/signin --auth John:test`
The successful response should return the associated hash string provided
when the user was created with a status code of `200`.

## Closing server

In server terminal, enter `control` + `c`.
