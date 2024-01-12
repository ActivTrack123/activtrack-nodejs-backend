const DSR = require('../models/DsrModel');
const mongoose = require('mongoose');

const DSRService = module.exports;

DSRService.createDSR = async function (payload, request, createdBy) {
    const percentage = calculatePercentage(payload);

    const {
        kam,
        bookingReference,
        bookingReceived,
        shipper,
        consignee,
        merchandisers,
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
            merchandisers,
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
            legAta2,
            createdBy,
            percentage,
        });

        return newDSR;
    } catch (err) {
        console.log(err)
        return { error: err };
    }
};

DSRService.updateDSR = async function (payload, request, updatedBy) {
    const percentage = calculatePercentage(payload);
    const {
        kam,
        bookingReference,
        bookingReceived,
        shipper,
        consignee,
        merchandisers,
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
            merchandisers,
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
            legAta2,
            $push: { updatedBy: updatedBy },
            percentage,
        });

        return dsr;
    } catch (err) {
        return { error: err };
    }
};

const calculatePercentage = (payload) => {
    const totalFields = Object.keys(payload).length;
    const filledFields = Object.values(payload).filter(value => value !== null && value !== '').length;
  
    return (filledFields / totalFields) * 100;
  };
