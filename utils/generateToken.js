const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  try {
    const payload = { email: user.email };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // TODO: save token to the user object in DB

    return { accessToken, refreshToken };
  } catch (err) {
    return err;
  }
};

module.exports = generateToken;
