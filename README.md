## Basic Auth for CFGram

This is a fun project where we created basic authentication for a basic Instagram API called CFGram.

### Get the Project Running

First, install MongoDB. The instructions are [here](https://docs.mongodb.com/manual/installation/).

Now, type the following in your command line:

1. `git clone https://github.com/brittdawn/15-basic_auth.git`
2. `cd 15-basic_auth`
3. `npm i`
4. `brew install httpie`
5. Open another terminal and type: `mongod`
6. Open yet another terminal and type: `node server.js` or `npm start`
7. Add a `.env` file to the root directory of this lab and add the following:

```
PORT='8000'
MONGODB_URI='mongodb://localhost/cfgram'
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

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImZlZmYzNjY2Y2I0MTMxMTYwZmY2ZGYxYmM3ZmIyMWFhNjc5NzFlMDZkMzk2MGYwNzdkNjRmYjI1ZTNhYzA5NzEiLCJpYXQiOjE0ODM0NzAyMjF9.Ug3fs21ijn_1cEX2pZi3N4DQJcyEPugg6YyFlunzw-k
```

## SignIn
### Test the API (GET)

After making a POST, you can make a GET request by signing in.

1. Make a GET request, like this example: `http get localhost:8000/api/signin -a user3:password3` since
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

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjRjNTRiZDlhYTMwMTM1OGJlMzNkZDUyZDY2YjE5ODkxOTEyNGQ5MTkzOGNhMDNiMzIzOTVlMWU0Njg1ZjM0MTEiLCJpYXQiOjE0ODM0NzI0NDZ9.mgo_VMcTfIaEbSoWUIlXjLswHLL5ZULW-e2egBtYPhU
```
