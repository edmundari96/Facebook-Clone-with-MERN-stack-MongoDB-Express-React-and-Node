// this is requiring the mongoose dependency which is a mongodb object modelling tool designed to work in an asynchronous environments. Mongoose supports both promises and callback
const mongoose = require("mongoose");

// the schema creates the shape of the data to be stored in the database
const PostSchema = new mongoose.Schema(
  {
    userId: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        max: 500
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
// const User = mongoose.model("User", schema);
// module.exports = User;
