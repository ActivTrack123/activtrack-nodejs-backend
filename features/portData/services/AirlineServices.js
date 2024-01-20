const Airline = require("../models/AirlineModel"); // Assuming you have an "airlineModel" for the Airline component
const mongoose = require("mongoose");

const airlineService = module.exports;

airlineService.createAirline = async function (payload, request) {
  const { name, status } = payload;
  try {
    const newAirline = await Airline.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newAirline;
  } catch (err) {
    return { error: err };
  }
};

airlineService.updateAirline = async function (payload, request) {
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const airline = await Airline.findByIdAndUpdate(id, {
      name,
      status,
    });
    return airline;
  } catch (err) {
    return { error: err };
  }
};
