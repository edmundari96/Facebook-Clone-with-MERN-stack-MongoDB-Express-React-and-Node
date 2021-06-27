// this is requiring the already installed express dependency used majorly for creating and managing http request and responses
const express = require("express");

// this is invoking the express super function in other to use the inbuilt properies and methods
const app = express();

//used to create object refrence (schema) used to perform crud on the database
const mongoose = require("mongoose");

// this is a dependency used to keep or hide delicate environmental variables
require('dotenv').config();

//this dependency helps to secure your thhp headers
const helmet = require("helmet");

// the dependency is used to log all the request made in an application
const morgan = require("morgan");

//this is the path to the route file// directs which page is served when a particular request is made
const userRoute = require("./routes/users");

//this is the path to the route file// directs which page is served when a particular request is made
const authRoute = require("./routes/auth");

//this is the path to the route file// directs which page is served when a particular request is made
const postRoute = require("./routes/posts");

// this is connection to the database using mongoose
mongoose.connect( process.env.MONGO_URL, { useNewUrlParser: true , useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, () => {
  console.log('Connected to the MongoDB............');

});

//MIDDLEWARES

//this is a builtin middleware function in express based on body parser and its function is to parse incoming requests with JSON payloads
app.use(express.json());

//this is nvoking the helmet dependency and using it
app.use(helmet());

// this is invoking the morgan dependency and and calling a custom parameter (common) which has a custom design log format
app.use(morgan("common"));

// this means "whenever there is a request for api/users call the userRoute" which is declared allready above
app.use("/api/users", userRoute);

// this means "whenever there is a request for api/auth call the authRoute" which is declared allready above
app.use("/api/auth", authRoute);

// this means "whenever there is a request for api/posts call the postRoute" which is declared allready above
app.use("/api/posts", postRoute);









app.listen(8800, () => {
  console.log("app is running on port 8800..............");
})