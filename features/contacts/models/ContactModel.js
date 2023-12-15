const mongoose = require("mongoose");
const { ContactStatus } = require("../../../config/constants");

const Schema = mongoose.Schema;

/**
 * Contact Schema
 */
const ContactSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: ContactStatus.PENDING,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", ContactSchema);
