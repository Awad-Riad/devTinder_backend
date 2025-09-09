const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../Models/connectionRequest");
const User = require("../Models/user");
const router = express.Router();

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "about",
      "age",
      "gender",
      "photoUrl",
    ]);

    res.json({
      message: "connection requests have been retrieved successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "something went wrong : " + error.message });
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId")
      .populate("toUserId");
    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        console.log(row.fromUserId.toString());
        console.log(loggedInUser._id.toString());
        return row.toUserId;
      }

      return row.fromUserId;
    });

    return res.json({
      message: "connections have been retrieved successfully",
      data,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "something went wrong : " + error.message });
  }
});

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName photoUrl skills")
      .skip(skip)
      .limit(limit);

    return res.json({ message: "users retreived successfully", users });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "something went wrong : " + error.message });
  }
});

module.exports = router;
