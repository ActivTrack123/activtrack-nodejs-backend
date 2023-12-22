const Carrier = require("../models/carrierModel");
const carrierService = require("../services/carrierServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const carrierController = {
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

      const carriers = await Carrier.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Carrier.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Carrier list retrieved!",
        data: {
          carriers,
          total,
          limit: carriers.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch carriers list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const carrier = await Carrier.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Carrier retrieved!",
        data: carrier,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch carrier!",
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
      const newCarrier = await carrierService.createCarrier(payload, request);

      if (!newCarrier.error) {
        return response.status(200).json({
          error: false,
          message: "Carrier created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create carrier!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create carrier!",
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
      const carrier = await carrierService.updateCarrier(payload, request);

      if (!carrier.error && carrier !== null) {
        return response.status(200).json({
          error: false,
          message: "Carrier updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update carrier!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update carrier!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const carrier = await Carrier.findByIdAndDelete(request.params.id);
      if (carrier !== null) {
        return response.status(200).json({
          error: false,
          message: "Carrier deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find carrier!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete carrier!",
        data: null,
      });
    }
  },
};

module.exports = carrierController;
