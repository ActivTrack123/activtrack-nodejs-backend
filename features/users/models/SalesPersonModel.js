const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Document = require("./DocumentModel").schema;
const Role = require("./RoleModel").schema;

const Schema = mongoose.Schema;

/**
 * SalesPerson Schema
 */
const SalesPersonSchema = new Schema({
  id: {type: String},
  name: {
    type: String,
    trim: true,
    required: true,
  },
 
  company: {
    type: String,
    trim: true,
  },
});


module.exports = mongoose.model("SalesPerson", SalesPersonSchema);
