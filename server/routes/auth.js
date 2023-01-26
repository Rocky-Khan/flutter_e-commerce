const express = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const authRouter = express.Router();

//  SIGN IN ROUTE
authRouter.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User with same email already exists!",
      });
    }

    const hashedPass = await bcryptjs.hash(password, 8);

    let user = new User({
      email,
      password: hashedPass,
      name,
    });
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  SIGN IN ROUTE
authRouter.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = User({ email, password });
    if (!user) {
      return res.status(400).json({ msg: "Incorrect Email" });
    }
    const isMatch = bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect Password" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = authRouter;
