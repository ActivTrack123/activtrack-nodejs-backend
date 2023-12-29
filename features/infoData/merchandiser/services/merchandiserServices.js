const Merchandiser = require("../models/merchandiserModel");
const mongoose = require("mongoose");

const merchandiserService = module.exports;

merchandiserService.createMerchandiser = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newMerchandiser = await Merchandiser.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newMerchandiser;
  } catch (err) {
    return { error: err };
  }
};

merchandiserService.updateMerchandiser = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const merchandiser = await Merchandiser.findByIdAndUpdate(id, {
      name,
      status,
    });
    return merchandiser;
  } catch (err) {
    return { error: err };
  }
};
