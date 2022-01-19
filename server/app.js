const express = require("express");
require("dotenv").config();
const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");

const jwt = require("./middleware/jwtVerify");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use(
  cors({
    origin: "https://www.mattdwhitson.com",
    credentials: true,
  })
);
app.use(jwt());
app.use(cookieParser());
app.use("/api/users", require("./controllers/userControllers"));
app.use("/api/chats", require("./controllers/chatControllers"));

app.use(errorHandler);

module.exports = app;
