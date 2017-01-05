# Basic Authorization
[![Build Status](https://travis-ci.org/jonathanheemstra/15-basic_auth.svg?branch=master)](https://travis-ci.org/jonathanheemstra/15-basic_auth)

## About
The basic authorization app currently allows a user to sign up `POST` and sign in `GET`. The application will provide a light layer of encryption by hashing the password before storing it in the database. Each user gets 4 properties `email`, `password`, `username`, and `findHash`. When creating a user the `email`, `password`, and `username` are required. The `findHash` is generated by the application.

## Starting the application
In order to run any of the CRUD operations available you will need to first install all dependencies by running `npm i` in the terminal. After installing all dependencies you need to run the server before any routes can be hit. To turn on the server run `npm start` in the terminal. Then in a separate terminal window you will now be able to run any of the Route commands listed below.

_Note: you will need to be in the root file directory of the application in order to run any of the CRUD routes._

## Routes
### POST
**Create User - Sign up**
#### `/api/signup`
* Create a new User via a POST request using HTTPie by using the following terminal command:
  * `http POST :<PORT NUMBER>/api/signup username='<UNIQUE USERNAME>' password='<PASSWORD>' email='<UNIQUE EMAIL>'`
  * _IMPORTANT: A USER MUST BE CREATED BEFORE YOU CAN CREATE A GALLERY OR UPLOAD AN IMAGE_

**Example of success response**

  ```
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 205
  Content-Type: text/html; charset=utf-8
  Date: Thu, 05 Jan 2017 17:14:18 GMT
  ETag: W/"cd-bq16pY3FVwxfJlIFmRzLTg"
  X-Powered-By: Express

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImZmMTEzODZjMTU2NmZhOTk5YmU1NTdlMDAyNDA0ZmQ0ZjgwZmE3ZjM0YzhkZjU4MTI0MzYzZDAzMDY0NWRmMDMiLCJpYXQiOjE0ODM2MzY0NTh9.ghli8t_5JmlL4AvmgJRRdkxaStPSPXGschEjcJEmlXU
  ```

#### `/api/gallery`
* Create a new Gallery via a POST request using HTTPie by using the following terminal command:
  * `http POST :<PORT NUMBER>/api/gallery Authorization:'Bearer <TOKEN>' name='<NAME>' description='<DESCRIPTION>'`
  * _Example of a token:_
  ```
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImZmMTEzODZjMTU2NmZhOTk5YmU1NTdlMDAyNDA0ZmQ0ZjgwZmE3ZjM0YzhkZjU4MTI0MzYzZDAzMDY0NWRmMDMiLCJpYXQiOjE0ODM2MzY0NTh9.ghli8t_5JmlL4AvmgJRRdkxaStPSPXGschEjcJEmlXU
  ```
  * NOTE: a token will be provided to you via response in the terminal as part of a successful user POST (`/api/signup`).

**Example of success response**

  ```
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 177
  Content-Type: application/json; charset=utf-8
  Date: Thu, 05 Jan 2017 17:29:52 GMT
  ETag: W/"b1-h2yPVSDiKZeEvREFkuF7EQ"
  X-Powered-By: Express

  {
      "__v": 0,
      "_id": "586e829011cc52b33ca47ee4",
      "dateCreated": "2017-01-05T17:29:52.623Z",
      "description": "gallery description",
      "name": "cool gallery",
      "userID": "586e7eea11cc52b33ca47ee3"
  }
  ```

#### `/api/gallery/:galleryID/image`
* Upload a new image to Amazon S3 via a POST request using HTTPie by using the following terminal command:
  * `http --form :<PORT>/api/gallery/<GALLERY ID>/image Authorization:'Bearer <TOKEN>' name='<IMAGE NAME>' description='<IMAGE DESCRIPTION>' image@<IMAGE LOCATION ON LOCAL MACHINE>`
  * _Example of Gallery Id_: `586e829011cc52b33ca47ee4`
  * _Example of image location:_ `/Users/jonny_heemstra/codefellows/401/lab-jonny/15-basic_auth/test/data/tester.png`


**Example of success response**

  ```
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 348
  Content-Type: application/json; charset=utf-8
  Date: Thu, 05 Jan 2017 17:59:20 GMT
  ETag: W/"15c-toynvhW8jp5A9j05K7129w"
  X-Powered-By: Express

  {
      "__v": 0,
      "_id": "586e8977a30848b585214df0",
      "created": "2017-01-05T17:59:19.972Z",
      "description": "cool image description",
      "galleryID": "586e858b11cc52b33ca47ee7",
      "imageURI": "https://fomogram.s3.amazonaws.com/1b2f5dedce5cf96af28503085a1baf64.png",
      "name": "cool image",
      "objectKey": "1b2f5dedce5cf96af28503085a1baf64.png",
      "userID": "586e855311cc52b33ca47ee6"
  }
  ```
