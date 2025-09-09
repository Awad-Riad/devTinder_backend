const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditprofileData } = require("../utils/validation/validations");

const router = express.Router();

router.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

   return  res
      .status(200)
      .json({ message: "user retrieved successfully", data: user });
  } catch (error) {
   return res.status(400).json({ message: "Something Went Wrong:" + error.message });
  }
});

router.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditprofileData(req)) {
      return res.status(400).json({ message: "Field Not Allowed" });
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => (user[key] = req.body[key]));
    await user.save();

    return res.json({ message: "User Profile Edited Successfully", user: user });
  } catch (error) {
    return res.status(400).json({ message: "Something Went Wrong:" + error.message });
  }
});

module.exports = router;
