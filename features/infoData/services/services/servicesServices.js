const Service = require("../models/servicesModel");
const mongoose = require("mongoose");

const serviceService = module.exports;

serviceService.createService = async function (payload, request) {
  // Updated function name
  const { name, status } = payload;
  try {
    const newService = await Service.create({
      // Updated model name
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newService;
  } catch (err) {
    return { error: err };
  }
};

serviceService.updateService = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const service = await Service.findByIdAndUpdate(id, {
      name,
      status,
    });
    return service;
  } catch (err) {
    return { error: err };
  }
};
