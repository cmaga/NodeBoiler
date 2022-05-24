/**
 * Create an Express application server and connect to MongoDB Atlas remote database (DB-as-a-Service). Use middleware layer to route to paths.
 */

const express = require('express');
const app = express();
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path: __dirname + `/config/.env`});

//Import routes
const usersRoute = require('./controllers/userApi');

const connectionString = process.env.NODE_ENV == 'dev' ? 'mongodb://localhost:27017/gm' : process.env.DB_CONNECTION;

//Connect Mongoose
mongoose.connect(
    connectionString,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    () => console.log("Mongoose buffered")
)

const mongooseConnection = mongoose.connection;
mongooseConnection.on('error', console.error.bind(console, "connection error: "));

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Route middleware urls
app.use('/api/users', usersRoute);

const port = process.env.PORT
app.listen(port, () => {
    console.log("Server running...attempting to connect to database");
});