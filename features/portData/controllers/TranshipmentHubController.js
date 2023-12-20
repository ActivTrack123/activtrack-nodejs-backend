const TranshipmentHub = require("../models/TranshipmentHubModel");
const TranshipmentHubService = require("../services/TranshipmentHubServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const TranshipmentHubController = {
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

      const transhipmentHubs = await TranshipmentHub.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await TranshipmentHub.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "TranshipmentHub list retrieved!",
        data: {
          transhipmentHubs,
          total,
          limit: transhipmentHubs.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch TranshipmentHub list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const transhipmentHub = await TranshipmentHub.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "TranshipmentHub retrieved!",
        data: transhipmentHub,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch TranshipmentHub!",
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
      const newTranshipmentHub = await TranshipmentHubService.createTranshipmentHub(payload, request);
      if (!newTranshipmentHub.error) {
        return response.status(200).json({
          error: false,
          message: "TranshipmentHub created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create TranshipmentHub!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create TranshipmentHub!",
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
      const transhipmentHub = await TranshipmentHubService.updateTranshipmentHub(payload, request);
      if (!transhipmentHub.error && transhipmentHub !== null) {
        return response.status(200).json({
          error: false,
          message: "TranshipmentHub updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update TranshipmentHub!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update TranshipmentHub!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const transhipmentHub = await TranshipmentHub.findByIdAndDelete(request.params.id);
      if (transhipmentHub !== null) {
        return response.status(200).json({
          error: false,
          message: "TranshipmentHub deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find TranshipmentHub!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete TranshipmentHub!",
        data: null,
      });
    }
  },
};

module.exports = TranshipmentHubController;
