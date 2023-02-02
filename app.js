const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectToDB = require("./DB/database");
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/", require("./routes/userRoute"));
app.use("/", require("./routes/userTodo"));

app.get("*", (req, res) => {
  res.status(404).send("404, Page not found");
});

app.listen(process.env.PORT, async () => {
  try {
    await connectToDB();
    console.log(`Server is up on port 5000`);
  } catch (e) {
    console.log(e);
  }
});
