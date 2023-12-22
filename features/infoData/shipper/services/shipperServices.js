const Shipper = require("../models/shipperModel");
const mongoose = require("mongoose");

const shipperService = module.exports;

shipperService.createShipper = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newShipper = await Shipper.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newShipper;
  } catch (err) {
    return { error: err };
  }
};

shipperService.updateShipper = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const shipper = await Shipper.findByIdAndUpdate(id, {
      name,
      status,
    });
    return shipper;
  } catch (err) {
    return { error: err };
  }
};
