const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tourSchema = new Schema({
  theme: { type: String, required: true },
  exhibitsType: { type: String, required: true },
  duration: { type: Number, required: true },
  cost: { type: Number, required: true },
  image: { type: String, required: true },
  guide: { type: Schema.Types.ObjectId, ref: "User", required: true },
  visitors: [{ type: Schema.Types.ObjectId, ref: "User" }],
  exhibits: [{ type: Schema.Types.ObjectId, ref: "Exhibit" }],
  slug: { type: String, slug: ["theme"], slug_padding_size: 4, unique: true },
});

module.exports = mongoose.model("Tour", tourSchema);
