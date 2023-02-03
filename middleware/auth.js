const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateToken = (req, res, next) => {
  const tokenAccess = req.header("token");

  if (!tokenAccess) {
    return res.status(400).json({ message: "User not logged In" });
  }

  try {
    jwt.verify(tokenAccess, process.env.JWT_KEY, async (err, decode) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      const user = await User.findOne({ _id: decode.data });
      if (user) {
        req.user = user._id;
        next();
      } else {
        res.json({ message: "failed" });
      }
    });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

module.exports = { validateToken };
