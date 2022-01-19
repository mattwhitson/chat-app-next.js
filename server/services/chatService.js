const Chat = require("../models/chat");
const Users = require("../models/user");
const urlHelper = require("../utils/urlHelper");

const create = async (req) => {
  const { username, friend } = req.body;
  const friendProfile = await Users.findOne({ username: friend });
  const userProfile = await Users.findOne({ username: username });

  console.log("hello");
  console.log(friend);

  if (!friendProfile) throw "This user does not exist... Please try again.";

  const chatExists = await Chat.findOne({ users: [username, friend] });

  if (chatExists) throw "This chat already exists...";

  const newChat = new Chat({
    users: [userProfile, friendProfile],
    lastSeen: [
      { username: userProfile.username, timestamp: Date.now() },
      { username: friendProfile.username, timestamp: Date.now(0) },
    ],
  });

  //lastSeen = [ { username: userProfile.username, lastVisited: Date.now() }] and repeat for other user!!!!!!! most definitely will work

  await newChat.save();
};

const getAll = async (req) => {
  const username = req.params.user;

  const chats = await Chat.find({ "users.username": username });

  if (!chats) throw "This user has not created any chats";

  return chats;
};

const retrieveChat = async (req) => {
  const id = req.params.id;

  const chat = await Chat.find({ _id: id });

  if (!chat) throw "Chat data could not be found...";

  return chat;
};

const sendMessage = async (req) => {
  const { message, id, username } = req.body;
  let newMessage;

  const isUrl = await urlHelper.getMetaTags(message);

  if (isUrl) {
    newMessage = {
      message: isUrl.message,
      description: isUrl.description,
      title: isUrl.title,
      image: isUrl.image,
      username,
      timestamp: Date.now(),
    };
  } else {
    newMessage = {
      message: message,
      username,
      timestamp: Date.now(),
    };
  }

  await Chat.findByIdAndUpdate(
    { _id: id },
    { $push: { messages: { newMessage } } },
    { new: true }
  );

  await Chat.findOneAndUpdate(
    { _id: id, "lastSeen.username": username },
    { $set: { "lastSeen.$.timestamp": Date.now() } },
    { new: true }
  );

  return newMessage;
};

const getChatServerSide = async (req) => {
  const { username, id } = req.body;

  const updatedChat = await Chat.findOneAndUpdate(
    { _id: id, "lastSeen.username": username },
    { $set: { "lastSeen.$.timestamp": Date.now() } },
    { new: true }
  );

  return updatedChat;
};

const updateLastSeen = async (req) => {
  const { username, id } = req.body;

  const updatedChat = await Chat.findOneAndUpdate(
    { _id: id, "lastSeen.username": username },
    { $set: { "lastSeen.$.timestamp": Date.now() } },
    { new: true }
  );

  return updatedChat;
};

module.exports = {
  create,
  getAll,
  retrieveChat,
  sendMessage,
  getChatServerSide,
  updateLastSeen,
};
