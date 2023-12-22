const PortDataDischarge = require("../models/PortDataDischargeModel");
const PortDataDischargeService = require("../services/PortDataDischargeServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const PortDataDischargeController = {
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
        query.$or = [
          { name: nameRegex },
          { status: nameRegex },
        ];
      }

      if (status) {
        const statusArr = status.split(",");
        query.status = { $in: statusArr };
      }

      const sort = {};

      // Define the allowed sortBy values
      const allowedSortValues = [
        "name",
        "status",
      
      ];

      if (allowedSortValues.includes(sortBy)) {
        sort[sortBy] = 1; // Can change the sort direction (1 for ascending, -1 for descending)
      } else {
        // Default sorting if sortBy is not provided or is not an allowed value
        sort.created = -1;
      }

      const portDataDischarges = await PortDataDischarge.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await PortDataDischarge.countDocuments(query);
      console.log(total)
      return response.status(200).json({
        error: false,
        message: "PortDataDischarge list retrieved!",
        data: {
          portDataDischarges,
          total,
          limit: portDataDischarges.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch PortDataDischarge list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const portDataDischarge = await PortDataDischarge.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "PortDataDischarge retrieved!",
        data: portDataDischarge,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch PortDataDischarge!",
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
      const newPortDataDischarge = await PortDataDischargeService.createPortDataDischarge(payload, request);
      if (!newPortDataDischarge.error) {
        return response.status(200).json({
          error: false,
          message: "PortDataDischarge created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create PortDataDischarge!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create PortDataDischarge!",
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
      const portDataDischarge = await PortDataDischargeService.updatePortDataDischarge(payload, request);
      if (!portDataDischarge.error && portDataDischarge !== null) {
        return response.status(200).json({
          error: false,
          message: "PortDataDischarge updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update PortDataDischarge!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update PortDataDischarge!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const portDataDischarge = await PortDataDischarge.findByIdAndDelete(request.params.id);
      if (portDataDischarge !== null) {
        return response.status(200).json({
          error: false,
          message: "PortDataDischarge deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find PortDataDischarge!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete PortDataDischarge!",
        data: null,
      });
    }
  },
};

module.exports = PortDataDischargeController;
