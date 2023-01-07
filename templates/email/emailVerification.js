const subjectMail = "OTP: For Email Signin";

const message = (otp) => {
  return (
    `Dear User, \n\n` +
    "OTP for your email verification is : \n\n" +
    `${otp}\n\n` +
    "This is a auto-generated email. Please do not reply to this email.\n\n"
  );
};

module.exports = { subjectMail, message };
