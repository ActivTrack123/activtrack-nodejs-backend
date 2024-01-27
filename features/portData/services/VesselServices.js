const Vessel = require('../models/VesselModel');
const mongoose = require('mongoose');

const VesselService = module.exports;

VesselService.createVessel = async function (payload, request) {
    const { name, lat, lng, action, status } = payload;
    const vesselname = await Vessel.findOne({name:name});
    if (vesselname) {
        throw new Error("Vessel name already in use.");
      }
    try {
        const newVessel = await Vessel.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            lat,
            lng,
            action,
            status
        });
        return newVessel;
    } catch (err) {
        return { error: err };
    }
};

VesselService.updateVessel = async function (payload, request) {
    const { name, lat, lng, action, status } = payload;
    try {
        const { id } = request.params;
        const vessel = await Vessel.findByIdAndUpdate(id, {
            name,
            lat,
            lng,
            action,
            status
        });
        return vessel;
    } catch (err) {
        return { error: err };
    }
};
