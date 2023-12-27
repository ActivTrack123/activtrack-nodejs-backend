const DSR = require("../models/DsrModel");
const DSRService = require("../services/DsrServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const DSRController = {
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

      const dsrs = await DSR.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await DSR.countDocuments(query);
      console.log(total)
      return response.status(200).json({
        error: false,
        message: "DSR list retrieved!",
        data: {
          dsrs,
          total,
          limit: dsrs.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch DSR list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const dsr = await DSR.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "DSR retrieved!",
        data: dsr,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch DSR!",
        data: null,
      });
    }
  },

  async create(request, response, next) {
    console.log("come")
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;
    console.log(payload)
    try {
      const newDSR = await DSRService.createDSR(payload, request);
      if (!newDSR.error) {
        
        return response.status(200).json({
          error: false,
          message: "DSR created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create DSR!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create DSR!",
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
      const dsr = await DSRService.updateDSR(payload, request);
      if (!dsr.error && dsr !== null) {
        return response.status(200).json({
          error: false,
          message: "DSR updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update DSR!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update DSR!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const dsr = await DSR.findByIdAndDelete(request.params.id);
      if (dsr !== null) {
        return response.status(200).json({
          error: false,
          message: "DSR deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find DSR!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete DSR!",
        data: null,
      });
    }
  },
};

module.exports = DSRController;
