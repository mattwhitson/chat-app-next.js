import axios from "axios";

const createChat = async (newChat) => {
  const { token, ...chat } = newChat;

  const response = await axios.post(`/api/chats/create`, chat, {
    withCredentials: true,
  });

  return response;
};

const getChats = async (user) => {
  const response = await axios.get(`/api/chats/${user.username}`, {
    withCredentials: true,
  });

  return response;
};

const getChat = async (id, user) => {
  const identification = id;
  const response = await axios.get(`/api/chats/chat/${identification}`, {
    withCredentials: true,
  });

  return response;
};

const getChatServerSide = async (id, cookie, user) => {
  const { username } = user;
  const data = { username, id };
  const response = await axios.post(
    `https://mattdwhitson.com/api/chats/chatssr`,
    data,
    {
      headers: {
        cookie,
      },
    },
    { withCredentials: true }
  );

  return response;
};

const sendMessage = async (message, id, user) => {
  const username = user.username;
  const data = { message, id, username };

  const response = await axios.post(`/api/chats/sendmessage`, data, {
    withCredentials: true,
  });

  return response;
};

const updateLastSeen = async (username, id) => {
  const data = { username, id };
  const response = await axios.post(`/api/chats/lastseen`, data, {
    withCredentials: true,
  });

  return response;
};

const functions = {
  createChat,
  getChats,
  getChat,
  sendMessage,
  getChatServerSide,
  updateLastSeen,
};

export default functions;
