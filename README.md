# FOMOGRAM
[![Build Status](https://travis-ci.org/jonathanheemstra/15-basic_auth.svg?branch=master)](https://travis-ci.org/jonathanheemstra/15-basic_auth)

## About
Fomogram (Fear Of Missing Out-gram) is a way in which you can upload images and complete with your friends to see who is having the best time. Now you don't have to wonder if your friends are having more fun than you, you can see that they are. ;)

Fomogram is a basic gallery application that allows a visitor to create a user, gallery, and upload images to Amazon S3.

### Details about Routes
[GET](#get-routes) |
[POST](#post-routes) |
[PUT](#put-routes) |
[DELETE](#delete-routes)

## Starting the application
In order to run any of the CRUD operations available you will need to first install all dependencies by running `npm i` in the terminal. After installing all dependencies you need to run the server before any routes can be hit. To turn on the server run `npm start` in the terminal. Then in a separate terminal window you will now be able to run any of the Route commands listed below.

_Note: you will need to be in the root file directory of the application in order to run any of the CRUD routes._

## POST Routes
### POST - Create User - Sign up
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

### POST - Create Gallery
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

### POST - Upload Image
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
      "galleryID": "586e829011cc52b33ca47ee4",
      "imageURI": "https://fomogram.s3.amazonaws.com/1b2f5dedce5cf96af28503085a1baf64.png",
      "name": "cool image",
      "objectKey": "1b2f5dedce5cf96af28503085a1baf64.png",
      "userID": "586e7eea11cc52b33ca47ee3"
  }
  ```

## GET Routes
### GET - Sign in
#### `/api/signin`
* Sign in as an authorized User via a GET request using HTTPie by using the following terminal command:
  * `http :<PORT NUMBER>/api/signin -a <USERNAME>:<PASSWORD>`
  * NOTE: username and password must match the user name and password when the user was created.

**Example of success response**

  ```
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 205
  Content-Type: text/html; charset=utf-8
  Date: Thu, 05 Jan 2017 19:10:40 GMT
  ETag: W/"cd-xTMrliCaGcGgzfRorUi5pw"
  X-Powered-By: Express

  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6ImZmMTEzODZjMTU2NmZhOTk5YmU1NTdlMDAyNDA0ZmQ0ZjgwZmE3ZjM0YzhkZjU4MTI0MzYzZDAzMDY0NWRmMDMiLCJpYXQiOjE0ODM2MzY0NTh9.ghli8t_5JmlL4AvmgJRRdkxaStPSPXGschEjcJEmlXU
  ```

### GET - Gallery by ID
#### `/api/gallery/:id`
* Access a gallery as an authorized User via a GET request using HTTPie by using the following terminal command:
  * `http :8080/api/gallery/<GALLERY ID> Authorization:'Bearer <TOKEN>'`
  * _Example of gallery id_: `586e829011cc52b33ca47ee4`

**Example of success response**
  ```
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 173
  Content-Type: application/json; charset=utf-8
  Date: Thu, 05 Jan 2017 19:13:33 GMT
  ETag: W/"ad-xyfjIcAzrPGGqSRyIHFkSg"
  X-Powered-By: Express

  {
      "__v": 0,
      "_id": "586e829011cc52b33ca47ee4",
      "dateCreated": "2017-01-05T17:29:52.623Z",
      "description": "example gallery",
      "name": "test gallery",
      "userID": "586e7eea11cc52b33ca47ee3"
  }
  ```

## PUT Routes
### PUT - Update Gallery Details
#### /api/gallery/:id
* Access and update gallery as an authorized User via a PUT request using HTTPie by using the following terminal command:
  * `http PUT :8080/api/gallery/<GALLERY ID> Authorization:'Bearer <TOKEN>' name='<UPDATED NAME>' description='<UPDATED DESCRIPTION>'`
  * _Example of gallery id_: `586e829011cc52b33ca47ee4`

**Example of success response**
  ```
  HTTP/1.1 200 OK
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Content-Length: 173
  Content-Type: application/json; charset=utf-8
  Date: Thu, 05 Jan 2017 19:23:24 GMT
  ETag: W/"ad-7mcQ43f+A2JIJVhUxpoSRg"
  X-Powered-By: Express

  {
      "__v": 0,
      "_id": "586e829011cc52b33ca47ee4",
      "dateCreated": "2017-01-05T17:29:52.623Z",
      "description": "updated description",
      "name": "new name",
      "userID": "586e7eea11cc52b33ca47ee3"
  }
  ```

## DELETE Routes
### DELETE - Gallery by ID
#### `/api/gallery/:id`
* Access and delete gallery as an authorized User via a DELETE request using HTTPie by using the following terminal command:
  * `http PUT :8080/api/gallery/<GALLERY ID> Authorization:'Bearer <TOKEN>'`
  * _Example of gallery id_: `586e829011cc52b33ca47ee4`

**Example of success response**
  ```
  HTTP/1.1 204 No Content
  Access-Control-Allow-Origin: *
  Connection: keep-alive
  Date: Thu, 05 Jan 2017 19:28:32 GMT
  X-Powered-By: Express
  ```

### DELETE - Image Upload
#### `/api/gallery/:galleryID/image/:imageID`
* Delete an image that was uploaded to Amazon S3 via a DELETE request using HTTPie by using the following terminal command:
  * `http DELETE :<PORT>/api/gallery/<GALLERY ID>/image/<IMAGE ID> Authorization:'Bearer <TOKEN>'`
  * _Example of Image Id_: `586e8977a30848b585214df0`


**Example of success response**

  ```

  ```

http --form :8080/api/gallery/586ea6b14ffc77c0c7142728/image Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjE5MzMzYjg1YzdmNGU2ZmRkYjU4NWQ1YjE1NDIwMWFhMjRiYjEyZWM3OTUxNDI0MGRjYmZlNzU1ODBjYjhmM2QiLCJpYXQiOjE0ODM2NDY2MDh9.3RQBGmo2YGCTCiqVLkTA6Tz_wr97fjjINFV3_0mALQk' name='stuff' description='cool' image@/Users/jonny_heemstra/codefellows/401/lab-jonny/15-basic_auth/test/data/tester.png

http DELETE :8080/api/gallery/586ea6b14ffc77c0c7142728/image/586ea77a4ffc77c0c7142729 Authorization:'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjE5MzMzYjg1YzdmNGU2ZmRkYjU4NWQ1YjE1NDIwMWFhMjRiYjEyZWM3OTUxNDI0MGRjYmZlNzU1ODBjYjhmM2QiLCJpYXQiOjE0ODM2NDY2MDh9.3RQBGmo2YGCTCiqVLkTA6Tz_wr97fjjINFV3_0mALQk'
