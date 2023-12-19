const Incoterm = require("../models/incotermsModel");
const incotermService = require("../services/incotermsServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const incotermController = {
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

      const incoterms = await Incoterm.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Incoterm.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Incoterm list retrieved!",
        data: {
          incoterms,
          total,
          limit: incoterms.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch incoterm list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const incoterm = await Incoterm.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Incoterm retrieved!",
        data: incoterm,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch incoterm!",
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
      const newIncoterm = await incotermService.createIncoterm(
        payload,
        request
      );

      if (!newIncoterm.error) {
        return response.status(200).json({
          error: false,
          message: "Incoterm created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create incoterm!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create incoterm!",
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
      const incoterm = await incotermService.updateIncoterm(payload, request);

      if (!incoterm.error && incoterm !== null) {
        return response.status(200).json({
          error: false,
          message: "Incoterm updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update incoterm!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update incoterm!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const incoterm = await Incoterm.findByIdAndDelete(request.params.id);
      if (incoterm !== null) {
        return response.status(200).json({
          error: false,
          message: "Incoterm deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find incoterm!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete incoterm!",
        data: null,
      });
    }
  },
};

module.exports = incotermController;
