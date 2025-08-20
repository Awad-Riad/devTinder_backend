const express = require("express");
const connectDB = require("./config/db");
const User = require("./Models/user");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());

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
    const isPasswordVaid = await bcrypt.compare(password, user.password);
    if (isPasswordVaid) {
      res.send({ message: "User login Successfully", data: user });
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

//get feed
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong:" + error.message });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send({ message: "user deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong:" + error.message });
  }
});

app.patch("/user/:id", async (req, res) => {
  const userId = req.params?.id;
  const data = req.body;
  const allowedUpdates = ["photoUrl", "about", "gender", "age", "skills"];

  try {
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });

    res.send({ message: "user updated successfully", user });
  } catch (error) {
    res.status(400).send({ message: "Something Went Wrong:" + error.message });
  }
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
