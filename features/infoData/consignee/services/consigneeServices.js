const Consignee = require("../models/consigneeModel");
const mongoose = require("mongoose");

const consigneeService = module.exports;

consigneeService.createConsignee = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newConsignee = await Consignee.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newConsignee;
  } catch (err) {
    return { error: err };
  }
};

consigneeService.updateConsignee = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const consignee = await Consignee.findByIdAndUpdate(id, {
      name,
      status,
    });
    return consignee;
  } catch (err) {
    return { error: err };
  }
};
