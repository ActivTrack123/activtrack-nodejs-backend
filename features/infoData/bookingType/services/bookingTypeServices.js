const BookingType = require("../models/bookingTypeModel"); // Updated import
const mongoose = require("mongoose");

const bookingTypeService = module.exports; // Updated export

bookingTypeService.createBookingType = async function (payload, request) {
  // Updated function name
  const { name, status } = payload;
  try {
    const newBookingType = await BookingType.create({
      // Updated model reference
      _id: new mongoose.Types.ObjectId(),
      name,
      status,
    });
    return newBookingType;
  } catch (err) {
    return { error: err };
  }
};

bookingTypeService.updateBookingType = async function (payload, request) {
  // Updated function name
  const { name, status } = payload;
  try {
    const { id } = request.params;
    const bookingType = await BookingType.findByIdAndUpdate(id, {
      // Updated model reference
      name,
      status,
    });
    return bookingType;
  } catch (err) {
    return { error: err };
  }
};
