const express = require("express");
const { validateSignUpData } = require("../utils/validation/validations");
const bcrypt = require("bcrypt");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/signup", async (req, res) => {
  //new instance from our user model
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, gender, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    });

    await user.save();
    return res.json({ message: "User Added Successfully", data: user });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    const isPasswordVaid = await user.validatePassword(password);
    if (isPasswordVaid) {
      const { password, ...userWithoutPassword } = user._doc; //to json the user info without the password
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true, // MUST be true for HTTPS (Cloud Run uses HTTPS)
        sameSite: "none", // CRITICAL for cross-origin cookies
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: undefined, // Don't set domain for Cloud Run
      });
      return res.json({
        message: "User login Successfully",
        data: userWithoutPassword,
      });
    } else {
      return res.status(404).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Something Went Wrong:" + error.message });
  }
});

router.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  return res.json({ message: "User Logged Out successfully" });
});

module.exports = router;
