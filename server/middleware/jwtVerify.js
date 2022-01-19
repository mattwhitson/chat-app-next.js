const expressJwt = require("express-jwt");

function jwt() {
  const secret = process.env.SECRET;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    getToken: function fromHeaderOrQuerystring(req) {
      if (req.headers.cookie) {
        const string = req.headers.cookie.split(";");
        const token = string[0].split("=");
        return token[1];
      } else {
        console.log("failure");
        return null;
      }
    },
  }).unless({
    path: [
      // public routes that don't require authentication
      "/api/users/authenticate",
      "/api/users/register",
      "/api/users/logout",
    ],
  });
}

module.exports = jwt;
