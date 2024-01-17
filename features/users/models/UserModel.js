const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Document = require("./DocumentModel").schema;
const Role = require("./RoleModel").schema;

const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  employId: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
  startDate: {
    type: Date,
    trim: true,
    required: true,
  },
  note: {
    type: String,
    trim: true,
    required: false,
  },
  // role: Role,
  role: { type: mongoose.Types.ObjectId, ref: "Role"},
  jobRole: {
    type: String,
    trim: true,
    required: true,
  },
  accountStatus: {
    type: Number,
    // required: true,
  },
  status: {
    type: String,
    // required: true,
  },
  // documents: {
  //     type: String,
  //     trim: true,
  //     required: false,
  // },
  photo: {
    type: String,
    trim: true,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  company: {
    type: String,
    trim: true,
  },
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
