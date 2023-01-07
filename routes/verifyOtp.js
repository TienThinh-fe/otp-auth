const router = require("express").Router();
var sha256 = require("js-sha256").sha256;
const generateToken = require("../utils/generateToken");

var dates = {
  convert: function (d) {
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

router.post("/verify-otp", async (req, res, next) => {
  var currentDate = new Date();
  const { otp, hash, email, expirationTime } = req.body;

  if (!otp) {
    const response = { Status: "Failure", Details: "OTP not Provided" };
    return res.status(400).send(response);
  }
  if (!email) {
    const response = { Status: "Failure", Details: "Check not Provided" };
    return res.status(400).send(response);
  }
  if (!hash) {
    const response = { Status: "Failure", Details: "Hash not Provided" };
    return res.status(400).send(response);
  }

  // check if OTP is expired or not
  try {
    if (dates.compare(currentDate, expirationTime) !== 1) {
      const hashUserInput = sha256(otp + email);

      // Success: response user the accessToken and refreshToken
      if (hashUserInput === hash) {
        const { accessToken, refreshToken } = generateToken(email);
        const response = {
          Status: "Success",
          Details: "OTP Verified",
          accessToken,
          refreshToken,
        };
        return res.status(200).send(response);
      } else {
        const response = { Status: "Failure", Details: "OTP not Verified" };
        return res.status(400).send(response);
      }
    } else {
      const response = { Status: "Failure", Details: "OTP Expired" };
      return res.status(400).send(response);
    }
  } catch (err) {
    const response = { Status: "Failure", Details: err.message };
    return res.status(400).send(response);
  }
});

module.exports = router;
