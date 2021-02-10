Northeastern University - Capstone 2020

Node.js backend code base for project server.

## Purpose
This is the backend server that will be support a mobile application for a food spoilage detection system

Using Express Web App framework with Mongoose MongoDB ODM for persistent data storage.
Connects with MongoDB Atlas SaaS remote database.
## Starting up the server side of the project
`npm install` To install necessary dependencies locally.

`npm run` To automatically run the backend using the nodemon version installed in the dependencies.

In order to connect to the database, the users public ip needs to be added for the Atlas cluster as it
only allows certain IPs to connect.

*An installation of node.js is also required

## Project Structure
```
src
├── app.js			app entry point
├── /api			controller layer: api routes
├── /config			config settings, env variables
├── /services		        service layer: business logic
├── /models			data access layer: database models
├── /scripts		        miscellaneous NPM scripts
├── /subscribers		async event handlers

test               test suites
```

This code base follows the industry standard 3 layer architecture to effectively
build on the principle of separation of concerns. Resulting in the following
application flow

1. Controllers receive incoming client requests, and they leverage services. (api)
2. Services contain all business logic, and can also make calls to the data access layer. (services)
3. The data access layer interacts with the database by performing queries. (models)
4. Results are passed back up to the service layer. (services)
5. The service layer can then hand everything back to the controller. (api)
6. The controller can then respond to the client!

** *parenthesis indicates current steps' current layer* **
   
In other words:
api receives request ->
calls service -> 
accesses the database through the model -> 
service layer receives data -> 
api responds

In the case that there is no business logic, ie a direct query data pull, then calling the model
directly avoids having to write extra functions that don't do anything.





