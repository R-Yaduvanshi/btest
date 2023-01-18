const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userController = Router();
const { UserModel } = require("../models/User.model");
userController.post("/signup", (req, res) => {
  const { email, password, age, name } = req.body;
  bcrypt.hash(password, 8, async (err, hash) => {
    if (err) {
      res.send("Something went wrong");
    }

    const new_user = new UserModel({
      name,
      email,
      password: hash,
      age,
    });

    try {
      await new_user.save();
      res.send({ Message: "Signup Success" });
    } catch (err) {
      res.send({ Message: "somthing went wrong" });
    }
  });
  res.send("Signup Success");
});

//Login
userController.post("/login", async (req, res) => {
  //   res.send("Login Success");
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.send({ Message: "User not found, signup please" });
  } else {
    const hash_password = user.password;
    const generated_token = jwt.sign(
      { userID: user._id },
      process.env.SECRET_KEY
    );
    bcrypt.compare(password, hash_password, (err, result) => {
      if (err) {
        res.send({ Message: "Something went Wrong" });
      }
      if (result == true) {
        res.send({
          Message: "Login Successfull",
          token: generated_token,
        });
      }
      if (result === false) {
        res.send({ Message: "Wrong password" });
      }
    });
  }
});

module.exports = {
  userController,
};
