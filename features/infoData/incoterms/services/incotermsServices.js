const Incoterm = require("../models/incotermsModel");
const mongoose = require("mongoose");

const incotermService = module.exports;

incotermService.createIncoterm = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newIncoterm = await Incoterm.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newIncoterm;
  } catch (err) {
    return { error: err };
  }
};

incotermService.updateIncoterm = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const incoterm = await Incoterm.findByIdAndUpdate(id, {
      name,
      status,
    });
    return incoterm;
  } catch (err) {
    return { error: err };
  }
};
