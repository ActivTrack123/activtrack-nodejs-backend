const Airport = require("../models/AirportModel"); // Assuming you have an "airportModel" for the Airport component
const mongoose = require("mongoose");

const airportService = module.exports;

airportService.createAirport = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newAirport = await Airport.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newAirport;
  } catch (err) {
    return { error: err };
  }
};

airportService.updateAirport = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const airport = await Airport.findByIdAndUpdate(id, {
      name,
      status,
    });
    return airport;
  } catch (err) {
    return { error: err };
  }
};
