// "start": "nodemon server.js",

const express = require("express");

const app = express();
app.use(express.json());

require("dotenv").config();
const { connection } = require("./config/db");
const port = process.env.PORT || 8000;
const { userController } = require("./Routes/user.routes");
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.use("/user", userController);

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connection to DB Success");
  } catch (err) {
    console.log("Connection to DB Failed");
    console.log("Err=>", err);
  }
  console.log(`listing on PORT ${port}`);
});
