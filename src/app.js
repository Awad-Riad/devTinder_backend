const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestroutes");
const User = require("./Models/user");


const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", authRouter);
app.use("/", authRouter);
app.use("/", authRouter);

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
