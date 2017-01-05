# **RESTful API using Express**

## Overview

  This application is an HTTP RESTful API that creates a user and authenticates a user sign in. It utilizes the GET & POST methods to add & authenticate records in a MongoDB.

## **How To Use API**

  * Clone this repository
  * Open a terminal and run `npm i` to install all the application dependencies

### **Start up MongoDB & Server**

  * run `mongod` in your terminal

  * run `npm run start` in a separate tab


In a new terminal window/tab run your HTTP method commands

### **POST Request**

  * To add user to the database.   
    `http POST localhost:[port]/api/signup username='[name]' email='[example@test.com]' password='[12345]'`


### **GET Request**

  * To authenticate user log in.  
    `http GET localhost:[port]/api/signin --auth [username]:[password]`
