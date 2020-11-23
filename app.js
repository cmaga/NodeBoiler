const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

//import routes
const usersRoute = require('./routes/users');
app.use('/users', usersRoute);

app.get('/', (req, res) => {
    res.send("Home route");
});

mongoose.connect( 
    process.env.DB_CONNECTION, 
    {useNewUrlParser: true, useUnifiedTopology: true}, 
    () => console.log("Connected to Database")
); 

const port = process.env.PORT

app.listen(port);