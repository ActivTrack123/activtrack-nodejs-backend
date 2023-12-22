const BookingType = require("../models/bookingTypeModel");
const bookingTypeService = require("../services/bookingTypeServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const bookingTypeController = {
  async index(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    try {
      const {
        page = 1,
        limit = 10,
        query: name,
        status,
        sortBy,
      } = request.query;

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const query = {};
      if (name) {
        const nameRegex = { $regex: new RegExp(name), $options: "i" };
        query.$or = [{ name: nameRegex }, { status: nameRegex }];
      }

      if (status) {
        const statusArr = status.split(",");
        query.status = { $in: statusArr };
      }

      const sort = {};

      // Define the allowed sortBy values
      const allowedSortValues = ["name", "status"];

      if (allowedSortValues.includes(sortBy)) {
        sort[sortBy] = 1; // Can change the sort direction (1 for ascending, -1 for descending)
      } else {
        // Default sorting if sortBy is not provided or is not an allowed value
        sort.created = -1;
      }

      const bookingTypes = await BookingType.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await BookingType.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "BookingType list retrieved!",
        data: {
          bookingTypes,
          total,
          limit: bookingTypes.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch bookingType list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const bookingType = await BookingType.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "BookingType retrieved!",
        data: bookingType,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch bookingType!",
        data: null,
      });
    }
  },

  async create(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;

    try {
      const newBookingType = await bookingTypeService.createBookingType(
        payload,
        request
      );

      if (!newBookingType.error) {
        return response.status(200).json({
          error: false,
          message: "BookingType created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create bookingType!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create bookingType!",
        data: null,
      });
    }
  },

  async update(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;

    try {
      const bookingType = await bookingTypeService.updateBookingType(
        payload,
        request
      );

      if (!bookingType.error && bookingType !== null) {
        return response.status(200).json({
          error: false,
          message: "BookingType updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update bookingType!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update bookingType!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const bookingType = await BookingType.findByIdAndDelete(
        request.params.id
      );
      if (bookingType !== null) {
        return response.status(200).json({
          error: false,
          message: "BookingType deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find bookingType!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete bookingType!",
        data: null,
      });
    }
  },
};

module.exports = bookingTypeController;
