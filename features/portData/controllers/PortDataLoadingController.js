const PortDataLoading = require("../models/PortDataLoadingModel");
const PortDataLoadingService = require("../services/PortDataLoadingServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const PortDataLoadingController = {
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

      const portDataLoadings = await PortDataLoading.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await PortDataLoading.countDocuments(query);
      return response.status(200).json({
        error: false,
        message: "PortDataLoading list retrieved!",
        data: {
          portDataLoadings,
          total,
          limit: portDataLoadings.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch PortDataLoading list!",
        data: null,
      });
    }
  },

  async allPortDataLoading(request,response,next){
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    try {
      const portDataLoadings = await PortDataLoading.find();
      const transformedPortDataLoadings = portDataLoadings.map(item => {
        return {
            id: item._id,
            name: item.name,
            status: item.status,
            created_at: item.created,
        };
    });
      return response.status(200).json(transformedPortDataLoadings);
    } catch (error) {
      console.error(error);
        return response.status(400).json({
            error: true,
            message: "Failed to fetch PortDataLoading list!",
            data: null,
        });
    }


  },

  async show(request, response, next) {
    try {
      const portDataLoading = await PortDataLoading.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "PortDataLoading retrieved!",
        data: portDataLoading,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch PortDataLoading!",
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
      const newPortDataLoading = await PortDataLoadingService.createPortDataLoading(payload, request);
      if (!newPortDataLoading.error) {
        return response.status(200).json({
          error: false,
          message: "PortDataLoading created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create PortDataLoading!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create PortDataLoading!",
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
      const portDataLoading = await PortDataLoadingService.updatePortDataLoading(payload, request);
      if (!portDataLoading.error && portDataLoading !== null) {
        return response.status(200).json({
          error: false,
          message: "PortDataLoading updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update PortDataLoading!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update PortDataLoading!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const portDataLoading = await PortDataLoading.findByIdAndDelete(request.params.id);
      if (portDataLoading !== null) {
        return response.status(200).json({
          error: false,
          message: "PortDataLoading deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find PortDataLoading!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete PortDataLoading!",
        data: null,
      });
    }
  },
};

module.exports = PortDataLoadingController;
