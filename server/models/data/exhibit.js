const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const exhibitSchema = new Schema({
  title: { type: String, required: true },
  dated: { type: String, required: true },
  material: { type: String, required: true },
  archiveId: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, slug: ["title"], slug_padding_size: 4, unique: true },
});

module.exports = mongoose.model("Exhibit", exhibitSchema);
