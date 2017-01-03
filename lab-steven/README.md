#Basic Auth
###Lab for 401 JS

###Overview
This is a simple app that practices basic authorization using the bcrypt and crypto modules.

###Installation
Clone this repo, then navigate to the `lab-steven` directory and run `npm i`. You will also need a way to practice GET and POST requests. For example code, this README will be making use of HTTPIE.

##Usage
###POST Requests
You can POST new users to the API at `/api/createuser` by passing in a username, email, and password in the request headers. You should receive back an authorization token.

* Example: `http POST :8080/api/createuser username="Test user" email="test@test.com" password="Testword"`

###GET Requests
You can GET users that have been posted to the API at `/api/signin`, by passing in the username you want and their password. If you pass in the wrong password, you will get a 401 error.

* Example: `http :8080/api/signin username="Test user" password="Testword"`
