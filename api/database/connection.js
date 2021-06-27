// this is requiring the mongoose dependency which is a mongodb object modelling tool designed to work in an asynchronous environments. Mongoose supports both promises and callback
// const mongoose = require('mongoose');

// mongoose.set("useCreateIndex", true);

// the connectDB is an asynchronous function that makes an asychronous call to connect to the database // with an exception handling the function tries to the connection and caches error if connection fails // in the try exception the db connection is accessed from the process.env which the environmental variable created by the dotenv dependency 
// const connectDB = async() => {
//     try {
//       const con = await mongoose.connect(process.env.MONGO_URL, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       });
//       console.log(`MongoDB connected: ${con.connection.host}`);
//     } catch (err) {
//       console.log(err);
//       process.exit(1);
//     }

// }

// module.exports = connectDB;
