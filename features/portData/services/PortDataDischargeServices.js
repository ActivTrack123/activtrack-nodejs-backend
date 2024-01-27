const PortDataDischarge = require('../models/PortDataDischargeModel');
const mongoose = require('mongoose');

const PortDataDischargeService = module.exports;

PortDataDischargeService.createPortDataDischarge = async function (payload, request) {
    const { name,  status } = payload;
    const portDischarge = await PortDataDischarge.findOne({name:name});
    if (portDischarge) {
        throw new Error("Port name already in use.");
      }
    try {
        const newPortDataDischarge = await PortDataDischarge.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            status
        });
        return newPortDataDischarge;
    } catch (err) {
        return { error: err };
    }
};

PortDataDischargeService.updatePortDataDischarge = async function (payload, request) {
    const { name,  status } = payload;
    try {
        const { id } = request.params;
        const portDataDischarge = await PortDataDischarge.findByIdAndUpdate(id, {
            name,
            status
        });
        return portDataDischarge;
    } catch (err) {
        return { error: err };
    }
};
