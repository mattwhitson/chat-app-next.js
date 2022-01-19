const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");
const registerSocket = require("./socket");

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("connected to mongoose");
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, function () {
  console.log("Server listening on port " + PORT);
});

const io = require("socket.io")(server, {
  path: "/api/socket",
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const onConnection = (socket) => {
  registerSocket(io, socket);
};

io.on("connection", onConnection);
