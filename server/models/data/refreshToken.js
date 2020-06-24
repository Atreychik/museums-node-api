const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  refreshTokens: [{ type: Schema.Types.String }],
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
