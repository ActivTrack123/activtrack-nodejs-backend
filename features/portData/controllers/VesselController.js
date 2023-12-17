const Vessel = require("../models/VesselModel");
const VesselService = require("../services/VesselServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const VesselController = {
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
          { email: nameRegex },
          { phone: nameRegex },
          { country: nameRegex },
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
        "email",
        "phone",
        "age",
        "country",
        "zipCode",
        "web",
        "description",
        "accountStatus",
      ];

      if (allowedSortValues.includes(sortBy)) {
        sort[sortBy] = 1; // Can change the sort direction (1 for ascending, -1 for descending)
      } else {
        // Default sorting if sortBy is not provided or is not an allowed value
        sort.created = -1;
      }

      const vessels = await Vessel.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Vessel.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Vessel list retrieved!",
        data: {
          vessels,
          total,
          limit: vessels.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch vessel list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const vessel = await Vessel.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Vessel retrieved!",
        data: vessel,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch vessel!",
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
      const newVessel = await VesselService.createVessel(payload, request);
      if (!newVessel.error) {
        return response.status(200).json({
          error: false,
          message: "Vessel created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create vessel!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create vessel!",
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
      const vessel = await VesselService.updateVessel(payload, request);
      if (!vessel.error && vessel !== null) {
        return response.status(200).json({
          error: false,
          message: "Vessel updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update vessel!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update vessel!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const vessel = await Vessel.findByIdAndDelete(request.params.id);
      if (vessel !== null) {
        return response.status(200).json({
          error: false,
          message: "Vessel deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find vessel!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete vessel!",
        data: null,
      });
    }
  },
};

module.exports = VesselController;
