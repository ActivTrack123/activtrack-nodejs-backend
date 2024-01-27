const TranshipmentHub = require('../models/TranshipmentHubModel');
const mongoose = require('mongoose');

const TranshipmentHubService = module.exports;

TranshipmentHubService.createTranshipmentHub = async function (payload, request) {
    const { name,  status } = payload;
    const transhipmenthub = await TranshipmentHub.findOne({name:name});
    if (transhipmenthub) {
        throw new Error("Transhipment hub name already in use.");
      }
    try {
        const newTranshipmentHub = await TranshipmentHub.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            status
        });
        return newTranshipmentHub;
    } catch (err) {
        return { error: err };
    }
};

TranshipmentHubService.updateTranshipmentHub = async function (payload, request) {
    const { name,  status } = payload;
    try {
        const { id } = request.params;
        const transhipmentHub = await TranshipmentHub.findByIdAndUpdate(id, {
            name,
            status
        });
        return transhipmentHub;
    } catch (err) {
        return { error: err };
    }
};
