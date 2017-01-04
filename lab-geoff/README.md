# Basic Authentication API

Example of using basic http authentication to sign users in.

## POST /api/signup
```js
{
  username: 'user1234',      //required
  email: 'user@example.com', //required
  password: 'hellopassword'  //required
}
```
* Returns token

## GET /api/signin
Requires HTTP authorization header with username and password.
* Returns token
