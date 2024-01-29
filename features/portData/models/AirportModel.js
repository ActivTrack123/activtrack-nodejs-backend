const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * Airport Schema
 */
const AirportSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
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

module.exports = mongoose.model("Airport", AirportSchema);
