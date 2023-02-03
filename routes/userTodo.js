const router = require("express").Router();
const Todo = require("../models/todo");
const User = require("../models/user");
const cors = require("cors");
router.use(cors());
router.use(require("express").json());
const { validateToken } = require("../middleware/auth");
const bodyParser = require("body-parser");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/create", validateToken, cors(), async (req, res) => {
  try {
    let users = await Todo.find({ userId: req.user });
    if (users.length > 0) {
      users = await Todo.find({ userId: req.user }).updateOne(
        {},
        {
          $push: {
            todo: req.body.todo[0],
          },
        }
      );
    } else {
      users = await Todo.create({
        todo: req.body.todo[0],
        userId: req.user,
      });
    }

    res.status(200).json({
      status: "success",
      result: users,
    });
  } catch (e) {
    res.status(400).json({
      status: "failed",
      error: e.message,
    });
  }
});

router.get("/user", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user });
    res.status(200).json({
      user,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

router.get("/allTodo", validateToken, async (req, res) => {
  try {
    const users = await Todo.find({ userId: req.user });
    res.status(200).json({
      users,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
});

module.exports = router;
