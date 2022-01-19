let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

module.exports = (io, socket) => {
  console.log("a user connected.");
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderId, receiverId, msg }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderId,
        msg,
      });
    }
  });

  socket.on("createChat", ({ username, receiverId }) => {
    console.log("we are here");
    const user = getUser(receiverId);
    console.log(receiverId);
    console.log(user);
    if (user) {
      io.to(user.socketId).emit("getChat", {
        username,
      });
    }
  });

  socket.on("updatedChat", ({ username, receiverId }) => {
    const user = getUser(receiverId);

    if (user) {
      console.log("sending...");
      io.to(user.socketId).emit("updateChats", { username });
    }
  });
};
