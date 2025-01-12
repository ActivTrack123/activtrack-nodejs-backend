const VesselSchedule = require("../models/VesselScheduleModel");
const VesselScheduleService = require("../services/VesselScheduleServices");
const { validationResult } = require("express-validator");
const moment = require('moment');

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
        pol,
        pod,
        sortBy,
      } = request.query;

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const query = {};
      if (name) {
        const nameRegex = { $regex: new RegExp(name), $options: "i" };
        query.$or = [
          { voyage: nameRegex },
          { voyage2: nameRegex },
          { portOfLoading: nameRegex}
        ];
      }

      if (pol) query.portOfLoading = pol;
      if (pod) query.portOfDischarge = pod;

      if (status) {
        const statusArr = status.split(",");
        query.status = { $in: statusArr };
      }

      // const sort = {};

      // // Define the allowed sortBy values
      // const allowedSortValues = [
      //   "portOfReceipt",
      //   // "status",
      // ];

      // if (allowedSortValues.includes(sortBy)) {
      //   // sort[sortBy] = 1; // Can change the sort direction (1 for ascending, -1 for descending)
      //   sort.created = -1;
      // } else {
      //   // Default sorting if sortBy is not provided or is not an allowed value
      //   sort.created = -1;
      // }

      const vesselSchedules = await VesselSchedule.find(query)
        // .sort(sort)
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
      const { pol, pod, vessel, voyage, vessel1, voyage1, vessel2, voyage2, route, tsPort } = request.query;
  
      // console.log("query>>", request.query);

      let query = {
        // portOfReceipt: por,
        portOfLoading: pol,
        portOfDischarge: pod,
        vesselName: vessel1,
        voyage: voyage1,
      }

      if(route !== 'DIRECT'){
        if (vessel2) query.connectingVessel = vessel2;
        if (voyage2) query.voyage2 = voyage2;
        if (tsPort) query.tsPort = tsPort;
      }
      // console.log(por, pol, pod, vessel, voyage, vessel1, voyage1, vessel2, voyage2, route, tsPort)
      // if (route === 'DIRECT') {
      //   // For direct route
      //   query = {
      //     portOfReceipt: por,
      //     portOfLoading: pol,
      //     portOfDischarge: pod,
      //     vesselName: vessel,
      //     voyage: voyage,
      //   };
      // } else {
      //   // For connecting route
      //   query = {
      //     portOfReceipt: por,
      //     portOfLoading: pol,
      //     portOfDischarge: pod,
      //     vesselName: vessel1,
      //     voyage: voyage1,
      //     connectingVessel: vessel2,
      //     voyage2: voyage2,
      //     tsPort: tsPort,
      //   };
      // }

      // console.log("find query", query);
  
      // Your logic to find the vessel schedule based on the provided parameters
      const foundVesselSchedule = await VesselSchedule.find(query);

      if (route === 'DIRECT') {
        const connectingFields = ['cfsCutoff2', 'cyCutoff2', 'etd2', 'atd2', 'eta2', 'ata2'];
        const hasConnectingFields = connectingFields.some(field => foundVesselSchedule.some(schedule => schedule[field]));
      
        if (hasConnectingFields) {
          return response.status(400).json({
            error: true,
            message: "Route is DIRECT, but unexpected connecting route information is present.",
            data: null,
          });
        }
      }
  
      if (foundVesselSchedule.length > 0) {
        return response.status(200).json({
          error: false,
          message: "VesselSchedule found!",
          data: foundVesselSchedule,
        });

      } 
      else {
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

  async getVesselShedule(request, response, next) {
    // const errors = validationResult(request);
  
    // if (!errors.isEmpty()) {
    //   return response.status(422).json({
    //     error: true,
    //     message: "Validation errors",
    //     data: errors,
    //   });
    // }

    try {
      const {pol,pod} = request.query;
      const query = {
        portOfLoading: pol,
        portOfDischarge: pod
      }
      var foundVesselSchedule=[]
      if (pol=='All' && pod=='All'){
         foundVesselSchedule = await VesselSchedule.find({});
      } else if(pol=='All'){
        foundVesselSchedule = await VesselSchedule.find({portOfDischarge: pod});
      } else if(pod=='All'){
        foundVesselSchedule = await VesselSchedule.find({portOfLoading: pol});
      } else{
        foundVesselSchedule = await VesselSchedule.find(query);
      }
      console.log("req came",pol,pod)
        return response.status(200).json(foundVesselSchedule);
         
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        error: true,
        message: "Failed to find VesselSchedule.",
        data: null,
      });
    }
  },

  

async getVesselSheduleNew(request, response, next) {
    try {
        const { pol, pod } = request.query;
        const query = {
            portOfLoading: pol,
            portOfDischarge: pod
        };
        let foundVesselSchedule = [];

        if (pol === 'All' && pod === 'All') {
            foundVesselSchedule = await VesselSchedule.find({});
        } else if (pol === 'All') {
            foundVesselSchedule = await VesselSchedule.find({ portOfDischarge: pod });
        } else if (pod === 'All') {
            foundVesselSchedule = await VesselSchedule.find({ portOfLoading: pol });
        } else {
            foundVesselSchedule = await VesselSchedule.find(query);
        }

        // Convert date fields to DD/MM/YYYY format
        foundVesselSchedule = foundVesselSchedule.map(schedule => {
          return {
              ...schedule._doc,
              bkgCutoff: schedule.bkgCutoff ? moment.utc(schedule.bkgCutoff).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              cfsCutoff1: schedule.cfsCutoff1 ? moment.utc(schedule.cfsCutoff1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              cyCutoff1: schedule.cyCutoff1 ? moment.utc(schedule.cyCutoff1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              etd1: schedule.etd1 ? moment.utc(schedule.etd1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              ata1: schedule.ata1 ? moment.utc(schedule.ata1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              eta1: schedule.eta1 ? moment.utc(schedule.eta1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              atd1: schedule.atd1 ? moment.utc(schedule.atd1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              cfsCutoff2: schedule.cfsCutoff2 ? moment.utc(schedule.cfsCutoff2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              cyCutoff2: schedule.cyCutoff2 ? moment.utc(schedule.cyCutoff2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              etd2: schedule.etd2 ? moment.utc(schedule.etd2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              atd2: schedule.atd2 ? moment.utc(schedule.atd2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              eta2: schedule.eta2 ? moment.utc(schedule.eta2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              ata2: schedule.ata2 ? moment.utc(schedule.ata2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
              created: schedule.created ? moment.utc(schedule.created).utcOffset('+05:30').format('DD/MM/YYYY') : '',
          };
      });
      

        console.log("req came", pol, pod);
        return response.status(200).json(foundVesselSchedule);

    } catch (error) {
        console.error(error);
        return response.status(500).json({
            error: true,
            message: "Failed to find VesselSchedule.",
            data: null,
        });
    }
},


async  getVesselSheduleId(request, response, next) {
  try {
      const vesselSchedule = await VesselSchedule.findById(request.params.id);
      console.log("vessel schedule by id ", request.params.id);

      // Convert date fields to DD/MM/YYYY format or empty string if null
      const formattedVesselSchedule = {
          ...vesselSchedule._doc,
          bkgCutoff: vesselSchedule.bkgCutoff ? moment.utc(vesselSchedule.bkgCutoff).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            cfsCutoff1: vesselSchedule.cfsCutoff1 ? moment.utc(vesselSchedule.cfsCutoff1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            cyCutoff1: vesselSchedule.cyCutoff1 ? moment.utc(vesselSchedule.cyCutoff1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            etd1: vesselSchedule.etd1 ? moment.utc(vesselSchedule.etd1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            ata1: vesselSchedule.ata1 ? moment.utc(vesselSchedule.ata1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            eta1: vesselSchedule.eta1 ? moment.utc(vesselSchedule.eta1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            atd1: vesselSchedule.atd1 ? moment.utc(vesselSchedule.atd1).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            cfsCutoff2: vesselSchedule.cfsCutoff2 ? moment.utc(vesselSchedule.cfsCutoff2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            cyCutoff2: vesselSchedule.cyCutoff2 ? moment.utc(vesselSchedule.cyCutoff2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            etd2: vesselSchedule.etd2 ? moment.utc(vesselSchedule.etd2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            atd2: vesselSchedule.atd2 ? moment.utc(vesselSchedule.atd2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            eta2: vesselSchedule.eta2 ? moment.utc(vesselSchedule.eta2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            ata2: vesselSchedule.ata2 ? moment.utc(vesselSchedule.ata2).utcOffset('+05:30').format('DD/MM/YYYY') : '',
            created: vesselSchedule.created ? moment.utc(vesselSchedule.created).utcOffset('+05:30').format('DD/MM/YYYY') : '',
      };

      return response.status(200).json(formattedVesselSchedule);
  } catch (error) {
      console.error(error);
      return response.status(400).json({
          error: true,
          message: "Failed to fetch VesselSchedule!",
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
      const createdBy=request.user.name
      const newVesselSchedule = await VesselScheduleService.createVesselSchedule(payload, createdBy);
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
    console.log(request)
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;

    try {
      
      const updatedBy=request.user.name
      const { id } = request.params;
      const updatedVesselSchedule = await VesselScheduleService.updateVesselSchedule(id, payload, updatedBy);
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
