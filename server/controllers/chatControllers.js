const express = require("express");
const router = express.Router();
const chatService = require("../services/chatService");

const createChat = async (req, res, next) => {
  chatService
    .create(req)
    .then((chat) => res.status(200).json(chat))
    .catch(next);
};

const getAll = async (req, res, next) => {
  chatService
    .getAll(req)
    .then((chats) => res.status(200).json(chats))
    .catch(next);
};

const retrieveChat = async (req, res, next) => {
  chatService
    .retrieveChat(req)
    .then((chat) => res.status(200).json(chat))
    .catch(next);
};

const sendMessage = async (req, res, next) => {
  chatService
    .sendMessage(req)
    .then((message) => res.status(200).json(message))
    .catch(next);
};

const getChatServerSide = async (req, res, next) => {
  chatService
    .getChatServerSide(req)
    .then((response) => res.status(200).json(response))
    .catch(next);
};

const updateLastSeen = async (req, res, next) => {
  console.log("here");
  chatService
    .updateLastSeen(req)
    .then((response) => res.status(200).json(response))
    .catch(next);
};

router.use("/create", createChat);

router.use("/chat/:id", retrieveChat);
router.use("/sendmessage", sendMessage);
router.use("/chatssr", getChatServerSide);
router.use("/lastseen", updateLastSeen);

router.use("/:user", getAll);

module.exports = router;
