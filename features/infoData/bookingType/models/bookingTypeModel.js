const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/**
 * BookingType Schema
 */
const BookingTypeSchema = new Schema({
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

module.exports = mongoose.model("BookingType", BookingTypeSchema);
