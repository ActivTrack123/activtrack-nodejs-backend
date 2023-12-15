const mongoose = require("mongoose");
const { NewAccountStatus } = require("../../../config/constants");

const Schema = mongoose.Schema;

/**
 * Contact Schema
 */
const AccountSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  accountName: {
    type: String,
    trim: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
    required: true,
  },
  accountOwnerAlias: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: NewAccountStatus.PENDING,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Account", AccountSchema);
