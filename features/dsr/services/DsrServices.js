const DSR = require('../models/DsrModel');
const mongoose = require('mongoose');

const DSRService = module.exports;

DSRService.createDSR = async function (payload, request) {
    const {
        kam,
        bookingReference,
        bookingReceived,
        shipper,
        consignee,
        merchandiser,
        pos,
        voyage,
        customerReference, // Rename to match the required field name
        agentReference,
        cargoReadyDate,
        bookingType,
        por,
        pol,
        pod,
        POR,
        route,
        shipmentType,
        packageType,
        weight,
        GP,
        hc,
        incoterm,
        bookingConfirmed,
        cargoReceived,
        mbl,
        hbl,
        containerNumber,
        devanning,
        status,
        remark,
        cfs1,
        voyage1,
        vessel1,
        legEtd1,
        legAtd1,
        legEta1,
        legAta1,
        cfs2,
        voyage2,
        vessel2,
        legEtd2,
        legAtd2,
        legEta2,
        legAta2
    } = payload;
    

    try {
        const newDSR = await DSR.create({
            _id: new mongoose.Types.ObjectId(),
            kam,
            bookingReference,
            bookingReceived,
            shipper,
            consignee,
            merchandiser,
            pos,
            shipmentType,
            cfs1,
            voyage,
            customerReference, // Rename to match the required field name
            agentReference,
            cargoReadyDate,
            bookingType,
            por,
            pol,
            pod,
            POR,
            route,
            shipmentType,
            packageType,
            weight,
            GP,
            hc,
            incoterm,
            bookingConfirmed,
            cargoReceived,
            mbl,
            hbl,
            containerNumber,
            devanning,
            status,
            remark,
            cfs1,
            voyage1,
            vessel1,
            legEtd1,
            legAtd1,
            legEta1,
            legAta1,
            cfs2,
            voyage2,
            vessel2,
            legEtd2,
            legAtd2,
            legEta2,
            legAta2
        });

        return newDSR;
    } catch (err) {
        console.log(err)
        return { error: err };
    }
};

DSRService.updateDSR = async function (payload, request) {
    const {
        kam,
        bookingReference,
        bookingReceived,
        shipper,
        consignee,
        merchandiser,
        pos,
        shipmentType,
        voyage,
        customerReference, // Rename to match the required field name
        agentReference,
        cargoReadyDate,
        bookingType,
        por,
        pol,
        pod,
        POR,
        route,
        packageType,
        weight,
        GP,
        hc,
        incoterm,
        bookingConfirmed,
        cargoReceived,
        mbl,
        hbl,
        containerNumber,
        devanning,
        status,
        remark,
        cfs1,
        voyage1,
        vessel1,
        legEtd1,
        legAtd1,
        legEta1,
        legAta1,
        cfs2,
        voyage2,
        vessel2,
        legEtd2,
        legAtd2,
        legEta2,
        legAta2
    } = payload;

    try {
        const { id } = request.params;
        const dsr = await DSR.findByIdAndUpdate(id, {
            kam,
            bookingReference,
            shipper,
            consignee,
            merchandiser,
            pos,
            shipmentType,
            voyage,
            bookingReceived,
            customerReference, // Rename to match the required field name
            agentReference,
            cargoReadyDate,
            bookingType,
            por,
            pol,
            pod,
            POR,
            route,
            packageType,
            weight,
            GP,
            hc,
            incoterm,
            bookingConfirmed,
            cargoReceived,
            mbl,
            hbl,
            containerNumber,
            devanning,
            status,
            remark,
            cfs1,
            voyage1,
            vessel1,
            legEtd1,
            legAtd1,
            legEta1,
            legAta1,
            cfs2,
            voyage2,
            vessel2,
            legEtd2,
            legAtd2,
            legEta2,
            legAta2
        });

        return dsr;
    } catch (err) {
        return { error: err };
    }
};