const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const cookie = require("cookie");

const authenticate = async (req, res, next) => {
  userService
    .authenticate(req)
    .then((user) => {
      const { token, ...userInfo } = user;
      res
        .setHeader(
          "Set-Cookie",
          cookie.serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60 * 24,
            sameSite: "none",
            path: "/",
          })
        )
        .status(200)
        .json(userInfo);
    })
    .catch(next);
};

const logout = async (req, res, next) => {
  userService
    .logout(req)
    .then((user) => {
      res
        .setHeader(
          "Set-Cookie",
          cookie.serialize("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 60 * 60,
            sameSite: "none",
            path: "/",
          })
        )
        .status(200)
        .json();
    })
    .catch(next);
};

const register = async (req, res, next) => {
  userService
    .register(req)
    .then((response) => res.status(200).json())
    .catch(next);
};

const get = async (req, res, next) => {
  userService
    .getUser(req)
    .then((user) => res.status(200).json(user))
    .catch(next);
};

const addProfilePicture = async (req, res, next) => {
  userService
    .addProfilePicture(req)
    .then((user) => res.status(200).json(user))
    .catch(next);
};

router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/getuser/:username", get);
router.post("/addprofilepic", addProfilePicture);
router.post("/logout", logout);

module.exports = router;
