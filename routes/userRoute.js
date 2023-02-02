const router = require("express").Router();
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

router.use(require("express").json());

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength((min = 7), (max = 12)),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        res.status(400).json({ message: error.array() });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({
          error: "user already exists",
        });
      }
      bcrypt.hash(password, 10, async function (err, hash) {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        const data = await User.create({
          email,
          password: hash,
        });
        res.status(200).json({
          status: "success",
          message: "Registration successful",
        });
      });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
    }
  }
);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const userData = await User.findOne({ email: email });
  if (userData !== null) {
    let result = await bcrypt.compare(password, userData.password);
    if (result) {
      const token = jwt.sign(
        {
          exp: Math.floor(Date.now() / 10) + 60 * 60,
          data: userData._id,
        },
        process.env.JWT_KEY
      );
      res.status(200).json({
        status: "successful",
        token: token,
      });
    } else {
      res.status(400).json({
        status: "failed",
        message: "wrong password",
      });
    }
  } else {
    res.status(400).json({
      status: "failed",
      message: "No user Found",
    });
  }
});

module.exports = router;
