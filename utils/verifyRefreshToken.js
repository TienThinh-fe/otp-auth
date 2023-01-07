const jwt = require("jsonwebtoken");

const verifyRefreshToken = (refreshToken) => {
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return { status: "Failure", details: err.message };
    } else {
      return { status: "Success", details: user };
    }
  });
};

module.exports = verifyRefreshToken;
