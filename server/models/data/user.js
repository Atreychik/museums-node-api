const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
  experience: { type: Number },
  languages: { type: String },
  isAproved: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
