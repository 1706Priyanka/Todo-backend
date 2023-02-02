const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectToDB = () => {
  return mongoose
    .connect(process.env.DB_URL, { useNewUrlParser: true })
    .then(() => {
      console.log("connection estabilished");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDB;
