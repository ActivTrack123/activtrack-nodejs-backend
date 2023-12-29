const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Merchandiser Schema
 */
const MerchandiserSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
  },

  status: {
    type: String,
    required: true,
    default: "Inactive",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Merchandiser", MerchandiserSchema);
