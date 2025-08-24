const express = require("express");
const { userAuth } = require("../utils/middlewares/auth");

const router = express.Router();

router.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  res.send({ data: user });
});

module.exports = router;
