const Service = require("../models/servicesModel");
const serviceServices = require("../services/servicesServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const serviceController = {
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

      const services = await Service.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Service.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Service list retrieved!",
        data: {
          services,
          total,
          limit: services.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch service list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const service = await Service.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Service retrieved!",
        data: service,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch service!",
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
      const newService = await serviceServices.createService(payload, request);

      if (!newService.error) {
        return response.status(200).json({
          error: false,
          message: "Service created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create service!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create service!",
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
      const service = await serviceServices.updateService(payload, request);

      if (!service.error && service !== null) {
        return response.status(200).json({
          error: false,
          message: "Service updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update service!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update service!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const service = await Service.findByIdAndDelete(request.params.id);
      if (service !== null) {
        return response.status(200).json({
          error: false,
          message: "Service deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find service!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete service!",
        data: null,
      });
    }
  },
};

module.exports = serviceController;
