# otp-auth

- Input: user's email
- Output: 
-- Sign in / Sign out 
### Specification:
- Stacks: JWT, NodeJs, Express (more if you want to)
### Non-func requirements: 
- OTP must be send to user's email (done)
- OTP will expired in 2 minutes (done)
### Func Requirements:
- User sign in by their email (done)
- User get the OTP in their email (done)
- User can log out (TODO)
- User keep login if the access token is not expired (TODO)

### Docs:

#### Generate OTP and send to email
- route: /api/request-otp
- resquest: {email: useremail@gmail.com}
- OTP is 6 digit expire within 2 minutes
- Hash (sha256) otp + email
- response a details object
- using nodemailer package to send email

**Currently, I am using my personal email and of course personal password for sending email**

#### Verify OTP 
- route: /api/verify-otp
- request: {otp, hash, email, expirationTime}
- check expirationTime
- check hashUserInput and hash from FE request
- response accessToken and refreshToken
