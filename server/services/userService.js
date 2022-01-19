const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("../models/user");
const User = require("../models/user");
const { findByIdAndUpdate, findOne } = require("../models/user");

const authenticate = async (req) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ username: username });

  if (!(user && bcrypt.compareSync(password, user.passwordHash))) {
    throw "Username or password is incorrect";
  }

  const token = jwt.sign({ sub: user._id }, process.env.SECRET, {
    expiresIn: "7d",
  });

  user.timestamp = Date.now();

  await user.save();

  const { _id, email, profilePicture, bio, ...userData } = user;

  return {
    username,
    email,
    _id,
    token,
    profilePicture,
    bio,
  };
};

const getUser = async (req) => {
  const username = req.params.username;

  const user = await Users.findOne({ username: username });

  if (!user) throw "this user does not exist...";

  return user;
};

const logout = async (req) => {
  return req.body.user;
};

const register = async (req) => {
  const { username, password, email, name } = req.body;

  if (await Users.findOne({ username: username }))
    throw "Username already taken....";

  const passwordHash = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    passwordHash,
    email,
    name,
    timestamp: Date.now(),
  });

  await newUser.save();
};

const addProfilePicture = async (req) => {
  const { downloadURL, id } = req.body;

  const user = await Users.findByIdAndUpdate(
    { _id: id },
    { profilePicture: downloadURL }
  );

  console.log(user);

  if (!user) throw "Something went seriously wrong...";

  return user;
};

module.exports = {
  authenticate,
  register,
  getUser,
  addProfilePicture,
  logout,
};
