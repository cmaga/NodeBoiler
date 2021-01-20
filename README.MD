Northeastern University - Capstone 2020

Node.js backend code base for project server.

## Purpose
This is the backend server that will be support a mobile application for a food spoilage detection system

Using Express Web App framework with Mongoose MongoDB ODM for persistent data storage.
Connects with MongoDB Atlas SaaS remote database.
## Starting up the server side of the project
`npm install` To install necessary dependencies locally.

`npx run nodemon` To automatically run the backend using the nodemon version installed in the dependencies.

In order to connect to the database, the users public ip needs to be added for the Atlas cluster as it
only allows certain ip's to connect.

*An installation of node.js is also required

