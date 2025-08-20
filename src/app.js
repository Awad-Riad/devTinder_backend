const express = require("express");
const connectDB = require("./config/db");
const User = require("./Models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./utils/middlewares/auth");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //new instance from our user model
  try {
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

app.post("/login", async (req, res) => {
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
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (user === null) {
      res.status(404).send({ message: "User not found" });
    }
    res.send({ message: "User found", user });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong:" + error.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send({ message: "user retrieved successfully", data: user });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong:" + error.message });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send({ data: user });
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");

    app.listen(7777, () => {
      console.log("Server is listning on port 7777");
    });
  })
  .catch((e) => {
    console.error("connot connected to the DB");
    console.error(e);
  });
