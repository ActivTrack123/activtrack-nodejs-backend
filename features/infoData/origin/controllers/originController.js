const Origin = require("../models/originModel");
const originService = require("../services/originServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const originController = {
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

      const origins = await Origin.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Origin.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Origin list retrieved!",
        data: {
          origins,
          total,
          limit: origins.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch origin list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const origin = await Origin.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Origin retrieved!",
        data: origin,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch origin!",
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
      const newOrigin = await originService.createOrigin(payload, request);

      if (!newOrigin.error) {
        return response.status(200).json({
          error: false,
          message: "Origin created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create origin!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create origin!",
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
      const origin = await originService.updateOrigin(payload, request);

      if (!origin.error && origin !== null) {
        return response.status(200).json({
          error: false,
          message: "Origin updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update origin!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update origin!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const origin = await Origin.findByIdAndDelete(request.params.id);
      if (origin !== null) {
        return response.status(200).json({
          error: false,
          message: "Origin deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find origin!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete origin!",
        data: null,
      });
    }
  },
};

module.exports = originController;
