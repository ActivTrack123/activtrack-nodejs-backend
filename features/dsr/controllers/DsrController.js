const SalesPerson = require("../../users/models/SalesPersonModel");
const DSR = require("../models/DsrModel");
const DSRService = require("../services/DsrServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const ActivityLog = require("../models/ActivityLog");

const changeStream = DSR.watch();
changeStream.on("change", async (change) => {
  let changeBy = "";

  if (change.fullDocument && change.fullDocument.createdBy) {
    changeBy = change.fullDocument.createdBy;
  } else if (change.updateDescription) {
    const updatedFields = change.updateDescription.updatedFields;
    const updatedBy = change.updateDescription.updatedFields.updatedBy;

    if (Array.isArray(updatedBy) && updatedBy.length > 0) {
      // Select the last updatedBy value if updatedBy is an array
      changeBy = updatedBy[updatedBy.length - 1];
    } else if (updatedFields) {
      const updatedByKeys = Object.keys(updatedFields).filter((key) =>
        key.startsWith("updatedBy")
      );

      if (updatedByKeys.length > 0) {
        const lastUpdatedByKey = updatedByKeys[updatedByKeys.length - 1];
        changeBy = updatedFields[lastUpdatedByKey];
      }
    }
  }

  const existingActivityLog = await ActivityLog.findOne({
    changeType: change.operationType,
    documentId: change.documentKey._id,
    changeDetails: change.updateDescription || change.fullDocument,
    timestamp: new Date(),
    changeBy: changeBy,
  });

  if (existingActivityLog) {
    return response.status(200).json({
      error: false,
      message: "Activity log already exist.",
      data: {},
    });
  }

  await ActivityLog.create({
    changeType: change.operationType,
    documentId: change.documentKey._id,
    changeDetails: change.updateDescription || change.fullDocument,
    timestamp: new Date(),
    changeBy: changeBy,
  });
});

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
        startDate,
        endDate,
        consignee,
        salesPerson,
        createdBy,
      } = request.query;

      // console.log(startDate, endDate, consignee, salesPerson)

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const query = {};

      if (startDate && endDate) {
        query.created = { $gte: new Date(startDate), $lt: new Date(endDate) };
      }

      if (createdBy) query.createdBy = createdBy;
      if (consignee) query.consignee = consignee;
      if (salesPerson) query.kam = salesPerson;

      console.log("all dsr", query, createdBy, startDate, "start");
      // console.log(query)

      // if (name) {
      //   const nameRegex = { $regex: new RegExp(name), $options: "i" };
      //   query.$or = [
      //     { name: nameRegex },
      //     { status: nameRegex },
      //   ];
      // }

      console.log("all dsr", query, createdBy, startDate, "start");

      const sort = {};

      // Define the allowed sortBy values
      const allowedSortValues = ["name", "status"];

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

      // console.log(dsrs)
      const total = await DSR.countDocuments();
      const kam = await SalesPerson.find({});

      const salesPersons = await SalesPerson.countDocuments({});
      console.log(dsrs.length, "result");
      // console.log(total)
      return response.status(200).json({
        error: false,
        message: "DSR list retrieved!",
        data: {
          dsrs,
          total,
          kam,
          salesPersons,
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

  async recentDSR(request, response, next) {
    try {
      const {
        page = 1,
        limit = 10,
        query: name,
        consignee,
        status,
        salesPerson,
        createdBy,
      } = request.query;

      console.log(request.user.name);
      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 3);

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      // console.log(consignee,salesPerson,dataEntryPerosn)
      const query = {};
      if (createdBy) query.createdBy = createdBy;
      if (consignee) query.consignee = consignee;
      if (status) query.status = status;
      if (salesPerson) query.kam = salesPerson;

      console.log("name", name);
      if (name) {
        const nameRegex = { $regex: new RegExp(name), $options: "i" };
        query.$or = [{ bookingReference: nameRegex }, { hbl: nameRegex }];
      }

      query.created = { $gte: twoMonthsAgo };
      const recentDSRs = await DSR.find(query)
        .sort({ created: -1 })
        .limit(parseInt(limit, 10))
        .skip(skip);

      const total = await DSR.countDocuments({
        created: { $gte: twoMonthsAgo },
      });
      console.log("recentDSRs", createdBy);

      const kam = await SalesPerson.find({});

      return response.status(200).json({
        error: false,
        message: "Active DSRs ",
        data: {
          dsrs: recentDSRs,
          total,
          kam,
          limit: recentDSRs.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.error(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch recent DSRs",
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
    // console.log("come")
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;
    console.log(
      "////////////////////////////////////////////////////////////////////////////////"
    );
    console.log(payload);
    try {
      const createdBy = request.user.name;

      const newDSR = await DSRService.createDSR(payload, request, createdBy);
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
      const updatedBy = request.user.name;

      const dsr = await DSRService.updateDSR(payload, request, updatedBy);
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

  async activityLog(request, response, next) {
    try {
      const dsrActivityLogs = await ActivityLog.find({
        documentId: request.params.id,
      }).sort({ timestamp: -1 });

      return response.status(200).json({
        error: false,
        message: "DSR retrieved!",
        data: {
          dsrActivityLogs,
        },
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
};

module.exports = DSRController;
