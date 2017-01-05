# ABOUT THIS PROJECT
This is a basic API with username and password creation and authorization as well as the ability to add, edit, check for and delete a album resource. The project uses base 64 encoding for user passwords and tokens for bearer authentication.

This was created as an assignment for the Code Fellows 401 JavaScript class.

# TO USE THIS PROJECT
Clone this repo at branch `16-bearer-auth` and type `npm i` in your terminal to download the dependencies.

##### To Start The Server
```npm run start```

##### - User POST Requests
```http POST localhost:8000/api/signup username="User Name" password="passwordhere" email="email@address.com"```
This will return a password hash.

##### - User GET Requests
```http localhost:8000/api/signin -a "User Name":"password"```
This will return a password hash.

Note: in the post and get lines above please replace the port number with whatever port is noted when you start.

# TO INCLUDE THIS API IN YOUR PROJECT
Clone this repo at branch `15-basic-auth` and type `npm i` in your terminal to download the dependencies. Download the dev dependencies, `npm i chai mocha superagent`.
