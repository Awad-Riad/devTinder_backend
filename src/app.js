const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestroutes");
const userRouter = require("./routes/userRoutes");
const User = require("./Models/user");
var cors = require("cors");

const app = express();
const PORT = 7777;
var corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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

    app.listen(PORT, () => {
      console.log("Server is listning on port 7777");
    });
  })
  .catch((e) => {
    console.error("connot connected to the DB");
    console.error(e);
  });
