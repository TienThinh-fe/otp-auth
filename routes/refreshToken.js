const router = require("express").Router();
const verifyRefreshToken = require("../utils/verifyRefreshToken");
const jwt = require("jsonwebtoken");

// get new refresh token
router.post("/refresh-token", async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    const response = {
      Status: "Failure",
      Details: "Refresh Token not Provided",
    };
    return res.status;
  }

  const { status, detail } = verifyRefreshToken(refreshToken);

  if (status === "Failure") {
    const response = { Status: "Failure", Details: detail };
    return res.status(400).send(response);
  } else {
    const accessToken = jwt.sign(detail, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "10m",
    });

    const response = { Status: "Success", Details: accessToken };
    return res.status(200).send(response);
  }
});

// logout

module.exports = router;
