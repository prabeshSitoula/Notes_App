const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, default: "user" },
  createdOn: { type: Date, default: Date.now }, // Updated to dynamically set the current date
});

module.exports = mongoose.model("User", userSchema);
