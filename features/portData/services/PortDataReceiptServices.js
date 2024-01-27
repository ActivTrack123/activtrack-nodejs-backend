const PortDataReceipt = require('../models/PortDataReceiptModel');
const mongoose = require('mongoose');

const PortDataReceiptService = module.exports;

PortDataReceiptService.createPortDataReceipt = async function (payload, request) {
    const { name,  status } = payload;
    const portReceipt = await PortDataReceipt.findOne({name:name});
    if (portReceipt) {
        throw new Error("Port name already in use.");
      }
    try {
        const newPortDataReceipt = await PortDataReceipt.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            status
        });
        return newPortDataReceipt;
    } catch (err) {
        return { error: err };
    }
};

PortDataReceiptService.updatePortDataReceipt = async function (payload, request) {
    const { name,  status } = payload;
    try {
        const { id } = request.params;
        const portDataReceipt = await PortDataReceipt.findByIdAndUpdate(id, {
            name,
            status
        });
        return portDataReceipt;
    } catch (err) {
        return { error: err };
    }
};
