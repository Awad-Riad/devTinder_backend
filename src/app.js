require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestroutes");
const userRouter = require("./routes/userRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const chatRouter = require("./routes/chatRoutes");
const User = require("./Models/user");
var cors = require("cors");
const http = require("http");
const initSocket = require("./utils/socket");

const app = express();

var corsOptions = {
  origin: true,
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
app.use("/", paymentRouter);
app.use("/", chatRouter);

// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   try {
//     const user = await User.findOne({ emailId: userEmail });
//     if (user === null) {
//       res.status(404).send({ message: "User not found" });
//     }
//     res.send({ message: "User found", user });
//   } catch (error) {
//     res.status(400).send({ message: "Something Went Wrong:" + error.message });
//   }
// });

const server = http.createServer(app);
initSocket(server);
const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    console.log("DB connected successfully");

    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server is listning on port 8080");
    });
  })
  .catch((e) => {
    console.error("connot connected to the DB");
    console.error(e);
    process.exit(1);
  });
