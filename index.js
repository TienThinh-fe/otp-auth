require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.PORT || 3001;

// Getting data in json format
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Setting up cors
var cors = require("cors");
var corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token"],
};
app.use(cors(corsOption));

//Importing Routes
const sendOtpToEmail = require("./routes/sendOtpToEmail");
const verifyOtp = require("./routes/verifyOtp");
const refreshToken = require("./routes/refreshToken");

//Using imported Routes
app.use("/api/", sendOtpToEmail);
app.use("/api/", verifyOtp);
app.use("/api/", refreshToken);

app.get("/", function (req, res) {
  console.log("route / is accessed.");
  res.send("Hi");
});

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
