const PortDataLoading = require('../models/PortDataLoadingModel');
const mongoose = require('mongoose');

const PortDataLoadingService = module.exports;

PortDataLoadingService.createPortDataLoading = async function (payload, request) {
    const { name,  status } = payload;
    const portLoading = await PortDataLoading.findOne({name:name});
    if (portLoading) {
        throw new Error("Port name already in use.");
      }
    try {
        const newPortDataLoading = await PortDataLoading.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            status
        });
        return newPortDataLoading;
    } catch (err) {
        return { error: err };
    }
};

PortDataLoadingService.updatePortDataLoading = async function (payload, request) {
    const { name,  status } = payload;
    try {
        const { id } = request.params;
        const portDataLoading = await PortDataLoading.findByIdAndUpdate(id, {
            name,
            status
        });
        return portDataLoading;
    } catch (err) {
        return { error: err };
    }
};
