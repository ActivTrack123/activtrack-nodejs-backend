const Consignee = require("../models/consigneeModel");
const consigneeService = require("../services/consigneeServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const consigneeController = {
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

      const consignees = await Consignee.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Consignee.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Consignee list retrieved!",
        data: {
          consignees,
          total,
          limit: consignees.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch consignee list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const consignee = await Consignee.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Consignee retrieved!",
        data: consignee,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch consignee!",
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
      const newConsignee = await consigneeService.createConsignee(
        payload,
        request
      );
      if (!newConsignee.error) {
        return response.status(200).json({
          error: false,
          message: "Consignee created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create consignee!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create consignee!",
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
      const Consignee = await consigneeService.updateConsignee(
        payload,
        request
      );
      if (!Consignee.error && Consignee !== null) {
        return response.status(200).json({
          error: false,
          message: "Consignee updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update consignee!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update consignee!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const consignee = await Consignee.findByIdAndDelete(request.params.id);
      if (consignee !== null) {
        return response.status(200).json({
          error: false,
          message: "Consignee deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find consignee!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete consignee!",
        data: null,
      });
    }
  },
};

module.exports = consigneeController;
