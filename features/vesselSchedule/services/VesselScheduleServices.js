const VesselSchedule = require('../models/VesselScheduleModel');
const mongoose = require('mongoose');

const VesselScheduleService = module.exports;

VesselScheduleService.createVesselSchedule = async function (payload) {
    const {
        portOfReceipt,
        portOfLoading,
        vesselName,
        voyage,
        bkgCutoff,
        cfsCutoff1,
        cyCutoff1,
        etd1,
        ata1,
        eta1,
        atd1,
        ataPod1,
        portOfDischarge,
        tsPort,
        connectingVessel,
        voyage2,
        cfsCutoff2,
        cyCutoff2,
        etd2,
        atd2,
        eta2,
        ata2,
        service,
        carrier,
        note
    } = payload;

    try {
        const newVesselSchedule = await VesselSchedule.create({
            _id: new mongoose.Types.ObjectId(),
            portOfReceipt,
            portOfLoading,
            vesselName,
            voyage,
            bkgCutoff,
            cfsCutoff1,
            cyCutoff1,
            etd1,
            ata1,
            atd1,
            eta1,
            ataPod1,
            portOfDischarge,
            tsPort,
            connectingVessel,
            voyage2,
            cfsCutoff2,
            cyCutoff2,
            etd2,
            atd2,
            eta2,
            ata2,
            service,
            carrier,
            note
        });

        return newVesselSchedule;
    } catch (err) {
        console.log(err);
        return { error: err };
    }
};

VesselScheduleService.updateVesselSchedule = async function (id, payload) {
    const {
        portOfReceipt,
        portOfLoading,
        vesselName,
        voyage,
        bkgCutoff,
        cfsCutoff1,
        cyCutoff1,
        etd1,
        ata1,
        eta1,
        atd1,
        ataPod1,
        portOfDischarge,
        tsPort,
        connectingVessel,
        voyage2,
        cfsCutoff2,
        cyCutoff2,
        etd2,
        atd2,
        eta2,
        ata2,
        service,
        carrier,
        note
    } = payload;

    try {
        const updatedVesselSchedule = await VesselSchedule.findByIdAndUpdate(id, {
            portOfReceipt,
            portOfLoading,
            vesselName,
            voyage,
            bkgCutoff,
            cfsCutoff1,
            cyCutoff1,
            etd1,
            atd1,
            ata1,
            eta1,
            ataPod1,
            portOfDischarge,
            tsPort,
            connectingVessel,
            voyage2,
            cfsCutoff2,
            cyCutoff2,
            etd2,
            atd2,
            eta2,
            ata2,
            service,
            carrier,
            note
        });

        return updatedVesselSchedule;
    } catch (err) {
        return { error: err };
    }
};
