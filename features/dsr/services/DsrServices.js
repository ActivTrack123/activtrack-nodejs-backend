const DSR = require('../models/DsrModel');
const mongoose = require('mongoose');

const DSRService = module.exports;

DSRService.createDSR = async function (payload, request, createdBy) {

    const lastDSR = await DSR.findOne({}, {}, { sort: { 'created': -1 } });
    let lastBookingNumber = 0;

    if (lastDSR && lastDSR.bookingReference) {
        // Extract the number part from the last booking reference
        const lastBookingParts = lastDSR.bookingReference.split('/');
        lastBookingNumber = parseInt(lastBookingParts[lastBookingParts.length - 1]);
    }

    const newBookingNumber = lastBookingNumber + 1;
    const newBookingReference = `GAL/SF/${newBookingNumber}`;

    const percentage = calculatePercentage(payload);

    const {
        kam,
        // bookingReference,
        bookingReceived,
        shipper,
        consignee,
        merchandisers,
        pos,
        voyage,
        customerReference, // Rename to match the required field name
        agentReference,
        originAgent,
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
        cbm,
        qty,
        voyage1,
        vessel1,
        legEtd1,
        legAtd1,
        legEta1,
        legAta1,
        transhipmentPorts,
        cfs2,
        voyage2,
        vessel2,
        legEtd2,
        legAtd2,
        legEta2,
        legAta2,
        carrier
    } = payload;
    

    try {
        const newDSR = await DSR.create({
            _id: new mongoose.Types.ObjectId(),
            kam,
            bookingReference: newBookingReference,
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
            originAgent,
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
            cbm,
            qty,
            voyage1,
            vessel1,
            legEtd1,
            legAtd1,
            legEta1,
            legAta1,
            transhipmentPorts,
            cfs2,
            voyage2,
            vessel2,
            legEtd2,
            legAtd2,
            legEta2,
            legAta2,
            createdBy,
            percentage,
            carrier
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
        originAgent,
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
        qty,
        cbm,
        voyage1,
        vessel1,
        legEtd1,
        legAtd1,
        legEta1,
        legAta1,
        transhipmentPorts,
        cfs2,
        voyage2,
        vessel2,
        legEtd2,
        legAtd2,
        legEta2,
        legAta2,
        carrier
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
            originAgent,
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
            qty,
            cbm,
            cfs1,
            voyage1,
            vessel1,
            legEtd1,
            legAtd1,
            legEta1,
            legAta1,
            transhipmentPorts,
            cfs2,
            voyage2,
            vessel2,
            legEtd2,
            legAtd2,
            legEta2,
            legAta2,
            $push: { updatedBy: updatedBy },
            percentage,
            carrier
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
