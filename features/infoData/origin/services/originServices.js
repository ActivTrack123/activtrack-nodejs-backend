const Origin = require("../models/originModel");
const mongoose = require("mongoose");

const originService = module.exports;

originService.createOrigin = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newOrigin = await Origin.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newOrigin;
  } catch (err) {
    return { error: err };
  }
};

originService.updateOrigin = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const origin = await Origin.findByIdAndUpdate(id, {
      name,
      status,
    });
    return origin;
  } catch (err) {
    return { error: err };
  }
};
