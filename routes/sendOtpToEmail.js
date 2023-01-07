const router = require("express").Router();
var otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
var sha256 = require("js-sha256").sha256;

// To add minutes to the current time
function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

router.post("/request-otp", async (req, res, next) => {
  try {
    const { email } = req.body;
    let emailSubject, emailMessage;
    if (!email) {
      const response = { Status: "Failure", Details: "Email not provided" };
      return res.status(400).send(response);
    }

    //Generate OTP
    const otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expirationTime = AddMinutesToDate(now, 2);

    // hash the otp + email + expiration time
    const hash = sha256(otp + email);

    // Create details object containing the email and otp id
    var details = {
      timestamp: now,
      email: email, // use this email for verification
      hash: hash,
      expirationTime: expirationTime,
      success: true,
      message: "OTP sent to user",
    };

    //Choose message template according type requested
    const {
      message,
      subjectMail,
    } = require("../templates/email/emailVerification");
    emailMessage = message(otp);
    emailSubject = subjectMail;

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // have not know why secure makes email cannot send
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `noreply@trysts.io`, // still not know why this email cannot display on gmail inbox, the email still user's email above
      to: `${email}`,
      subject: emailSubject,
      text: emailMessage,
    };

    await transporter.verify();

    //Send Email
    await transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(400).send({ Status: "Failure", Details: err });
      } else {
        return res.send({ Status: "Success", Details: details });
      }
    });
  } catch (err) {
    const response = { Status: "Failure", Details: err.message };
    return res.status(400).send(response);
  }
});

module.exports = router;
