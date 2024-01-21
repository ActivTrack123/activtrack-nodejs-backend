const Airline = require("../models/AirlineModel");
const airlineService = require("../services/AirlineServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const airlineController = {
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

      const airlines = await Airline.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Airline.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Airline list retrieved!",
        data: {
          airlines,
          total,
          limit: airlines.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch airline list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const airline = await Airline.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Airline retrieved!",
        data: airline,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch airline!",
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
      const newAirline = await airlineService.createAirline(payload, request);

      if (!newAirline.error) {
        return response.status(200).json({
          error: false,
          message: "Airline created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create airline!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create airline!",
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
      const airline = await airlineService.updateAirline(payload, request);

      if (!airline.error && airline !== null) {
        return response.status(200).json({
          error: false,
          message: "Airline updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update airline!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update airline!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const airline = await Airline.findByIdAndDelete(request.params.id);
      if (airline !== null) {
        return response.status(200).json({
          error: false,
          message: "Airline deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find airline!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete airline!",
        data: null,
      });
    }
  },
};

module.exports = airlineController;
