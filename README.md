# Basic-Bearer Auth API Using MongoDB and Express

This project creates a user and a gallery while authenticating user using [Express.js](http://expressjs.com/) and [MongoDB](https://docs.mongodb.com/). Users send a POST request to create user and GET request to authenticate sign in through the terminal. Once a user has been created and receives a token, they are able to send requests to the gallery enpoints.
When sending User POST requests, use filepath `/api/signup`.
When sending User GET requests, use filepath `/api/signin`.
When sending Gallery requests, use filepath `/api/gallery`.
You will need [HTTPie](https://httpie.org/) to send requests through the terminal.

## How to run

Install any Dependencies from the `package.json` file into the project root
directory. Using [Node.js](https://nodejs.org/), to create a `package.json` file, enter command `npm init` in the project root.
You can run the command `npm i` to install all dependencies.

## Running server

Run the `server.js` file using command `node server.js` or `npm run start`. In terminal, you should see `Server up: 8000` or
port that is set in your environmental variable in terminal.

## Sending POST GET PUT DELETE Request

##User

###POST Request

>Create User POST Request

In an new terminal window, send a `POST` request by using the command
`http POST localhost:8000/api/signup username=<name> password=<password> email=<email>`.
Example: `http POST localhost:8000/api/signup username='John' password='1234' email='john@email.com'`
The successful response should return a generated token along with a status code of `200`.

###GET Request

>User Sign In GET Request

In an new terminal window, send a `GET` request by using the command `http localhost:8000/api/signin --auth <username>:<password>`.
Example: `http localhost:8000/api/signin --auth John:test`
The successful response should return the associated token provided
when the user was created with a status code of `200`.

##Gallery

###POST Request

>Create Gallery POST Request

Send a gallery `POST` request by using the command
`http POST localhost:8000/api/gallery Authorization:'Bearer <token> name=<name> desc=<description>`.
Example: `http POST localhost:8000/api/gallery Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhlMWJhYTdhZWEzYjE2Nzk0YjU1MmE2YmRkNTY1MmFhOTA1Y2M0ZTAzMzQxMGZhNDQwYTY2YjIyNjRjYWZhMjMiLCJpYXQiOjE0ODM1NTA4NzB9.Q07tDAmqQl9vQ56C3WzfRRVHap8Kj1v24RnArulNO5Q name='pictures' desc='cute pics'`
The successful response should return a jSON object along with a status code of `200`.

###GET Request

>Gallery GET Request

Send a gallery `GET` request by using the command
`http GET localhost:8000/api/gallery/<galleryID> Authorization:'Bearer <token>`.
Example: `http GET localhost:8000/api/gallery/586d30d5da6a390abd6ad6d9 Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhlMWJhYTdhZWEzYjE2Nzk0YjU1MmE2YmRkNTY1MmFhOTA1Y2M0ZTAzMzQxMGZhNDQwYTY2YjIyNjRjYWZhMjMiLCJpYXQiOjE0ODM1NTA4NzB9.Q07tDAmqQl9vQ56C3WzfRRVHap8Kj1v24RnArulNO5Q`
The successful response should return a jSON object along with a status code of `200`.


###PUT Request

>Update Gallery PUT Request

Send a gallery `PUT` request by using the command
`http PUT localhost:8000/api/gallery/<galleryID> Authorization:'Bearer <token> name=<name> desc=<description>`.
Example: `http PUT localhost:8000/api/gallery/586d30d5da6a390abd6ad6d9 Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhlMWJhYTdhZWEzYjE2Nzk0YjU1MmE2YmRkNTY1MmFhOTA1Y2M0ZTAzMzQxMGZhNDQwYTY2YjIyNjRjYWZhMjMiLCJpYXQiOjE0ODM1NTA4NzB9.Q07tDAmqQl9vQ56C3WzfRRVHap8Kj1v24RnArulNO5Q name='updated name' desc='updated description'`
The successful response should return a jSON object with updated values along with a status code of `200`.

###DELETE Request

>Gallery DELETE Request

Send a gallery `DELETE` request by using the command
`http DELETE localhost:8000/api/gallery/<galleryID> Authorization:'Bearer <token>`.
Example: `http POST localhost:8000/api/gallery/586d30d5da6a390abd6ad6d9 Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhlMWJhYTdhZWEzYjE2Nzk0YjU1MmE2YmRkNTY1MmFhOTA1Y2M0ZTAzMzQxMGZhNDQwYTY2YjIyNjRjYWZhMjMiLCJpYXQiOjE0ODM1NTA4NzB9.Q07tDAmqQl9vQ56C3WzfRRVHap8Kj1v24RnArulNO5Q'`
The successful response should return an empty object along with a status code of `204`.


## Closing server

In server terminal, enter `control` + `c`.
