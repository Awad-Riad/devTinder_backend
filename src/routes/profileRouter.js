const express = require("express");
const { userAuth } = require("../utils/middlewares/auth");


const router = express.Router();


router.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;
  
      res.send({ message: "user retrieved successfully", data: user });
    } catch (error) {
      res.status(400).send({ message: "Something Went Wrong:" + error.message });
    }
  });

  module.exports=router