const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
