const Merchandiser = require("../models/merchandiserModel");
const merchandiserService = require("../services/merchandiserServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const merchandiserController = {
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

      const merchandisers = await Merchandiser.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Merchandiser.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Merchandiser list retrieved!",
        data: {
          merchandisers,
          total,
          limit: merchandisers.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch merchandiser list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const merchandiser = await Merchandiser.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Merchandiser retrieved!",
        data: merchandiser,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch merchandiser!",
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
      const newMerchandiser = await merchandiserService.createMerchandiser(
        payload,
        request
      );

      if (!newMerchandiser.error) {
        return response.status(200).json({
          error: false,
          message: "Merchandiser created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create merchandiser!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create merchandiser!",
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
      const merchandiser = await merchandiserService.updateMerchandiser(
        payload,
        request
      );

      if (!merchandiser.error && merchandiser !== null) {
        return response.status(200).json({
          error: false,
          message: "Merchandiser updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update merchandiser!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update merchandiser!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const merchandiser = await Merchandiser.findByIdAndDelete(
        request.params.id
      );
      if (merchandiser !== null) {
        return response.status(200).json({
          error: false,
          message: "Merchandiser deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find merchandiser!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete merchandiser!",
        data: null,
      });
    }
  },
};

module.exports = merchandiserController;
