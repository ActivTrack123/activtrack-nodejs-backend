const Airport = require("../models/AirportModel");
const airportService = require("../services/AirportServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const airportController = {
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

      const airports = await Airport.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Airport.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Airport list retrieved!",
        data: {
          airports,
          total,
          limit: airports.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch airport list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const airport = await Airport.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Airport retrieved!",
        data: airport,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch airport!",
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
      const newAirport = await airportService.createAirport(payload, request);

      if (!newAirport.error) {
        return response.status(200).json({
          error: false,
          message: "Airport created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create airport!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create airport!",
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
      const airport = await airportService.updateAirport(payload, request);

      if (!airport.error && airport !== null) {
        return response.status(200).json({
          error: false,
          message: "Airport updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update airport!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update airport!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const airport = await Airport.findByIdAndDelete(request.params.id);
      if (airport !== null) {
        return response.status(200).json({
          error: false,
          message: "Airport deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find airport!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete airport!",
        data: null,
      });
    }
  },
};

module.exports = airportController;
