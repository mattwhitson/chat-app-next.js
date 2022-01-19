const mongoose = require("mongoose");
const Message = require("./message");
const User = require("./user");

const ChatSchema = mongoose.Schema({
  users: {
    type: Array,
    required: true,
  },
  messages: {
    type: Array,
  },
  lastSeen: {
    type: Object,
  },
});

module.exports = mongoose.model("Chat", ChatSchema);
