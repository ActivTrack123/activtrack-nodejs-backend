const VesselSchedule = require("../models/VesselScheduleModel");
const VesselScheduleService = require("../services/VesselScheduleServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const VesselScheduleController = {
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

      const vesselSchedules = await VesselSchedule.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });

      const total = await VesselSchedule.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "VesselSchedule list retrieved!",
        data: {
          vesselSchedules,
          total,
          limit: vesselSchedules.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch VesselSchedule list!",
        data: null,
      });
    }
  },

  async findVesselSchedule(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    try {
      const { por, pol, pod, vessel, voyage } = request.query;
      console.log(por, pol, pod, vessel, voyage )
      // Your logic to find the vessel schedule based on the provided parameters
      const foundVesselSchedule = await VesselSchedule.find({
        portOfReceipt: por,
        portOfLoading: pol,
        portOfDischarge: pod,
        vesselName: vessel,
        voyage: voyage,
      });

      if (foundVesselSchedule.length > 0) {
        return response.status(200).json({
          error: false,
          message: "VesselSchedule found!",
          data: foundVesselSchedule,
        });
      } else {
        console.log("pass error no mathch error")
        return response.status(404).json({
          error: true,
          message: "No matching VesselSchedule found.",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        error: true,
        message: "Failed to find VesselSchedule.",
        data: null,
      });
    }
  },


  async show(request, response, next) {
    try {
      const vesselSchedule = await VesselSchedule.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "VesselSchedule retrieved!",
        data: vesselSchedule,
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch VesselSchedule!",
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
      const newVesselSchedule = await VesselScheduleService.createVesselSchedule(payload);
      if (!newVesselSchedule.error) {
        return response.status(200).json({
          error: false,
          message: "VesselSchedule created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create VesselSchedule!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create VesselSchedule!",
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
      const { id } = request.params;
      const updatedVesselSchedule = await VesselScheduleService.updateVesselSchedule(id, payload);
      if (!updatedVesselSchedule.error && updatedVesselSchedule !== null) {
        return response.status(200).json({
          error: false,
          message: "VesselSchedule updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update VesselSchedule!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to update VesselSchedule!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const vesselSchedule = await VesselSchedule.findByIdAndDelete(request.params.id);
      if (vesselSchedule !== null) {
        return response.status(200).json({
          error: false,
          message: "VesselSchedule deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Cannot find VesselSchedule!",
          data: null,
        });
      }
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to delete VesselSchedule!",
        data: null,
      });
    }
  },
};

module.exports = VesselScheduleController;
