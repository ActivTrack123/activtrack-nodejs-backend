const PortDataReceipt = require("../models/PortDataReceiptModel");
const PortDataReceiptService = require("../services/PortDataReceiptServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const PortDataReceiptController = {
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
      // console.log(page,limit,name,status,sortBy)
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

      const portDataReceipts = await PortDataReceipt.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await PortDataReceipt.countDocuments(query);
      return response.status(200).json({
        error: false,
        message: "PortDataReceipt list retrieved!",
        data: {
          portDataReceipts,
          total,
          limit: portDataReceipts.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch PortDataReceipt list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const portDataReceipt = await PortDataReceipt.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "PortDataReceipt retrieved!",
        data: portDataReceipt,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch PortDataReceipt!",
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
      const newPortDataReceipt = await PortDataReceiptService.createPortDataReceipt(payload, request);
      if (!newPortDataReceipt.error) {
        return response.status(200).json({
          error: false,
          message: "PortDataReceipt created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create PortDataReceipt!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      if (error.message === "Port name already in use.") {
        return response.status(400).json({
            error: true,
            message: "Port name already in use.",
            data: null,
        });
    } else {
        return response.status(400).json({
            error: true,
            message: "Failed to create PortDataLoading!",
            data: null,
        });
    }
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
      const portDataReceipt = await PortDataReceiptService.updatePortDataReceipt(payload, request);
      if (!portDataReceipt.error && portDataReceipt !== null) {
        return response.status(200).json({
          error: false,
          message: "PortDataReceipt updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update PortDataReceipt!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update PortDataReceipt!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const portDataReceipt = await PortDataReceipt.findByIdAndDelete(request.params.id);
      if (portDataReceipt !== null) {
        return response.status(200).json({
          error: false,
          message: "PortDataReceipt deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find PortDataReceipt!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete PortDataReceipt!",
        data: null,
      });
    }
  },
};

module.exports = PortDataReceiptController;
