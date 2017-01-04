#Basic Auth
###Lab for 401 JS

###Overview
This is a simple app that practices basic authorization using the bcrypt and crypto modules and bearer authentication.

###Installation
Clone this repo, then navigate to the `lab-steven` directory and run `npm i`.

##Usage - Users
###POST Requests
You can POST new users to the API at `/api/createuser` by passing in a username, email, and password in the request headers. You should receive back an authorization token.

###GET Requests
You can GET users that have been posted to the API at `/api/signin`, by passing in the username you want and their password in your request headers. If you pass in the wrong password, you will get a 401 error.

##Usage - Students
###POST Requests
You can POST new students to the API at `/api/student` by passing in a name, age, and within the headers of your request, the bearer token you got when you created a new user.

###GET Requests
You can GET students POSTed to the API at `/api/student/:id` by passing in the student's unique ID in the `:id` field of the URL, and including your bearer token in the request headers. If you do not include an ID, you will get back an array of all student IDs.

###PUT Requests
These work like a combination of a GET and POST - access `/api/student/:id`, pass in your bearer token to the request header, and also include the update name and/or age field for the student.

###DELETE Requests
You can DELETE students the same way you make a GET request.
