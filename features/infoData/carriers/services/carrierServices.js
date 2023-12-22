const Carrier = require("../models/carrierModel");
const mongoose = require("mongoose");

const carrierService = module.exports;

carrierService.createCarrier = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newCarrier = await Carrier.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newCarrier;
  } catch (err) {
    return { error: err };
  }
};

carrierService.updateCarrier = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const carrier = await Carrier.findByIdAndUpdate(id, {
      name,
      status,
    });
    return carrier;
  } catch (err) {
    return { error: err };
  }
};
