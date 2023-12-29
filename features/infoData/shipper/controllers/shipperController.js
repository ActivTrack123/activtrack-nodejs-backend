const Shipper = require("../models/shipperModel");
const shipperService = require("../services/shipperServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const shipperController = {
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

      const shippers = await Shipper.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Shipper.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Shipper list retrieved!",
        data: {
          shippers,
          total,
          limit: shippers.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch shipper list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const shipper = await Shipper.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Shipper retrieved!",
        data: shipper,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch shipper!",
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
      const newShipper = await shipperService.createShipper(payload, request);

      if (!newShipper.error) {
        return response.status(200).json({
          error: false,
          message: "Shipper created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create shipper!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create shipper!",
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
      const shipper = await shipperService.updateShipper(payload, request);

      if (!shipper.error && shipper !== null) {
        return response.status(200).json({
          error: false,
          message: "Shipper updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update shipper!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update shipper!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const shipper = await Shipper.findByIdAndDelete(request.params.id);
      if (shipper !== null) {
        return response.status(200).json({
          error: false,
          message: "Shipper deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find shipper!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete shipper!",
        data: null,
      });
    }
  },
};

module.exports = shipperController;
