## Bearer Auth for picgram

This is a fun project where we created basic and bearer authentication for a basic Instagram API called picgram.

A visualization of the project may be seen here ![alt img](https://raw.githubusercontent.com/codefellows/seattle-javascript-401d12/master/16-bearer_auth/demo/visualization/picgram.png). Credit: [Brian Nations](https://github.com/bnates)

### Get the Project Running

First, install MongoDB. The instructions are [here](https://docs.mongodb.com/manual/installation/).

Now, type the following in your command line:

1. `git clone https://github.com/brittdawn/15-basic_auth.git`
2. `cd 15-basic_auth`
3. `npm install`
4. `brew install httpie`
5. Open another terminal and type: `mongod`
6. Open yet another terminal and type: `npm start`
7. Add a `.env` file to the root directory of this lab and add the following:

```
PORT='8000'
MONGODB_URI='mongodb://localhost/picgram'
APP_SECRET='thisisasecret'
```

These are your environment variables. Be sure to add your `.env` file to your `.gitignore` since you want to keep this information secret. Shhh...

You will now see the phrase "Server is up: 8000" if you have not already specified a port number.

## SignUp
### Test the API (POST)

1. Open a new terminal located at the root of this project and type `http POST localhost:8000/api/signup username="user2" password="password2" email="testing2@test.com"`
2. You should get a JSON response with a `200` status code, and a token for future authentication, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 205
Content-Type: text/html; charset=utf-8
Date: Tue, 03 Jan 2017 19:03:41 GMT
ETag: W/"cd-vJLWlT+ADjDgdcMElCLuPA"
X-Powered-By: Express

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImQ4OTM4M2E2ZjM1OGYyMWUyY2UwNGY3N2E5YjNhOGJjMDcwODU3YjkzNGU3NGMwOWJjZTllM2UzN2IyZjdhNDMiLCJpYXQiOjE0ODM1MDUxNjd9.wBf9SkzdSXOaBb1CA1ajk0n2EYNvrmhOrGhX16m-RJg
```

## SignIn
### Test the API (GET)

After making a POST, you can make a GET request by signing in.

1. Make a GET request, like this example: `http GET localhost:8000/api/signin -a user3:password3` since
upon splitting off the end of the Basic base64 string, we can transform this into a UTF-8 string and grab the username and password as they are now available and split with a : --
ex: username:password. The `-a` allows for authorization, as explained here: http://blog.mashape.com/postman-httpie-test-apis/.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 205
Content-Type: text/html; charset=utf-8
Date: Tue, 03 Jan 2017 19:40:46 GMT
ETag: W/"cd-OBWf8LruAeFgYeDnItRDkw"
X-Powered-By: Express

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImQ4OTM4M2E2ZjM1OGYyMWUyY2UwNGY3N2E5YjNhOGJjMDcwODU3YjkzNGU3NGMwOWJjZTllM2UzN2IyZjdhNDMiLCJpYXQiOjE0ODM1MDUxNjd9.wBf9SkzdSXOaBb1CA1ajk0n2EYNvrmhOrGhX16m-RJg
```

## Photobook
### Test the API (POST)

1. Open a new terminal located at the root of this project, grab the token, and type `http POST localhost:8000/api/photobook Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImQ4OTM4M2E2ZjM1OGYyMWUyY2UwNGY3N2E5YjNhOGJjMDcwODU3YjkzNGU3NGMwOWJjZTllM2UzN2IyZjdhNDMiLCJpYXQiOjE0ODM1MDUxNjd9.wBf9SkzdSXOaBb1CA1ajk0n2EYNvrmhOrGhX16m-RJg" name="meow" desc="description"`
2. You should get a JSON response with a `200` status code and a response, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 150
Content-Type: application/json; charset=utf-8
Date: Wed, 04 Jan 2017 04:51:40 GMT
ETag: W/"96-fowLtPX+YcEqyy4h70ADRA"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "586c7f5c7b26425f3c8f3dd0",
    "created": "2017-01-04T04:51:40.839Z",
    "desc": "description",
    "name": "meow",
    "userID": "586c7e0f7b26425f3c8f3dc7"
}
```

### Test the API (GET)

After making a POST, you can make a GET request by grabbing the `_id` from the POST request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a GET request, like this example: `http localhost:8000/api/photobook/586c7f5c7b26425f3c8f3dd0 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhjZWE1NjYzNzUxNjllOTkwZDhjNDk1ZWM4NzI0NGM0YTEzZDYzMWIzNjQ0MzRjMzRmMGM2NDEyZmYzMzg2MGMiLCJpYXQiOjE0ODM1MDg5NDN9.IFuAMB0p_TW4W1AUSgbAAcjZF8l-L4fF6msHGhEe_Po"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 145
Content-Type: application/json; charset=utf-8
Date: Wed, 04 Jan 2017 05:52:17 GMT
ETag: W/"91-KaSGTNMILzMoRXFQyGu19Q"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "586c7f5c7b26425f3c8f3dd0",
    "created": "2017-01-04T05:49:55.717Z",
    "desc": "description",
    "name": "meow",
    "userID": "586c7e0f7b26425f3c8f3dc7"
}
```

### Test the API (PUT)

After making a POST, you can make a PUT request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a PUT request, like this example: `http PUT localhost:8000/api/photobook/586c7f5c7b26425f3c8f3dd0 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhjZWE1NjYzNzUxNjllOTkwZDhjNDk1ZWM4NzI0NGM0YTEzZDYzMWIzNjQ0MzRjMzRmMGM2NDEyZmYzMzg2MGMiLCJpYXQiOjE0ODM1MDg5NDN9.IFuAMB0p_TW4W1AUSgbAAcjZF8l-L4fF6msHGhEe_Po" name="newname" desc="newdescription"`.

2. You should get a JSON response with a `200` status code, like this example:

``` javascript
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 145
Content-Type: application/json; charset=utf-8
Date: Wed, 04 Jan 2017 05:52:17 GMT
ETag: W/"91-KaSGTNMILzMoRXFQyGu19Q"
X-Powered-By: Express

{
    "__v": 0,
    "_id": "586c7f5c7b26425f3c8f3dd0",
    "created": "2017-01-04T05:49:55.717Z",
    "desc": "newdescription",
    "name": "newname",
    "userID": "586c7e0f7b26425f3c8f3dc7"
}
```

### Test the API (DELETE)

After making a POST, you can make a DELETE request by grabbing the `_id` from the POST or GET request and adding it as a param to the url. Don't forget to grab your token too.

1. Make a DELETE request, like this example: `http DELETE localhost:8000/api/photobook/586c7f5c7b26425f3c8f3dd0 Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhjZWE1NjYzNzUxNjllOTkwZDhjNDk1ZWM4NzI0NGM0YTEzZDYzMWIzNjQ0MzRjMzRmMGM2NDEyZmYzMzg2MGMiLCJpYXQiOjE0ODM1MDg5NDN9.IFuAMB0p_TW4W1AUSgbAAcjZF8l-L4fF6msHGhEe_Po"`.

2. You should get a JSON response with a `204` status code, like this example:

``` javascript
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
Connection: keep-alive
Date: Wed, 04 Jan 2017 06:09:56 GMT
ETag: W/"11-3pphLxOhDYpB51tvzh8yow"
X-Powered-By: Express
```

3. If you make another GET request to this particular id param, you will get a `404` status code, like this example:

``` javascript
HTTP/1.1 404 Not Found
Access-Control-Allow-Origin: *
Connection: keep-alive
Content-Length: 13
Content-Type: text/html; charset=utf-8
Date: Wed, 04 Jan 2017 06:10:00 GMT
ETag: W/"d-8ImJlDOBcq5A9PkBq5sbQw"
X-Powered-By: Express

NotFoundError
```
