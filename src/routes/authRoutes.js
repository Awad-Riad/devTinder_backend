const express = require("express");
const {validateSignUpData}=require('../utils/validation/validations')
const bcrypt = require("bcrypt");
const User = require('../Models/user');
const jwt = require("jsonwebtoken");

const router = express.Router();


router.post("/signup", async (req, res) => {
    //new instance from our user model
    try {
        validateSignUpData(req);
      const { firstName, lastName, emailId, password } = req.body;
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
      });
  
      await user.save();
      res.send({ message: "User Added Successfully", data: user });
    } catch (err) {
      res.status(400).send({ message: err.message });
    }
  });
  
  router.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        res.status(404).send({ message: "Invalid Credentials" });
      }
      const isPasswordVaid = await user.validatePassword(password);
      if (isPasswordVaid) {
        const { password, ...userWithoutPassword } = user._doc; //to send the user info without the password
        const token = await user.getJWT();
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.send({
          message: "User login Successfully",
          data: userWithoutPassword,
        });
      } else {
        res.status(404).send({ message: "Invalid Credentials" });
      }
    } catch (error) {
      res.status(400).send({ message: "Something Went Wrong:" + error.message });
    }
  });




module.exports = router;
