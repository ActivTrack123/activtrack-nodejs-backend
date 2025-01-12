const DSR = require('../models/AirFreightModel');
// const AirFreight = require('../models/DsrModel');
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
    const newBookingReference = `GAL/AF/${newBookingNumber}`;
    const percentage = calculatePercentage(payload);

    const {
        kam,
        bookingReceived,
        shipper,
        consignee,
        merchandisers,
        // bookingReference,
        customerReference, // Rename to match the required field name
        airline,
        cargoReadyDate,
        pol,
        pod,
        transhipmentPorts,
        qty,
        packageType,
        weight,
        cbm,
        route,
        incoterm,
        bookingConfirmed,
        status,
        hawb,
        mawb,
        remark,
        legEtd1,
        legAtd1,
        legEta1,
        legAta1,
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
            bookingReceived,
            shipper,
            consignee,
            merchandisers,
            bookingReference : newBookingReference,
            customerReference, // Rename to match the required field name
            airline,
            cargoReadyDate,
            pol,
            pod,
            transhipmentPorts,
            qty,
            route,
            packageType,
            weight,
            cbm,
            incoterm,
            bookingConfirmed,
            status,
            hawb,
            mawb,
            remark,
            legEtd1,
            legAtd1,
            legEta1,
            legAta1,
            legEtd2,
            legAtd2,
            legEta2,
            legAta2,
            carrier,
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
    console.log("payload", payload);
    const percentage = calculatePercentage(payload);
    const {
        kam,
        bookingReceived,
        shipper,
        consignee,
        merchandisers,
        bookingReference,
        customerReference, // Rename to match the required field name
        airline,
        cargoReadyDate,
        pol,
        pod,
        route,
        transhipmentPorts,
        qty,
        packageType,
        weight,
        cbm,
        incoterm,
        bookingConfirmed,
        status,
        hawb,
        mawb,
        remark,
        legEtd1,
        legAtd1,
        legEta1,
        legAta1,
        legEtd2,
        legAtd2,
        legEta2,
        legAta2,
        carrier
    } = payload;

    try {
        console.log("params id", request.params);
        const { id } = request.params;
        const dsr = await DSR.findByIdAndUpdate(id, {
            kam,
            bookingReceived,
            shipper,
            consignee,
            merchandisers,
            bookingReference,
            customerReference, // Rename to match the required field name
            airline,
            cargoReadyDate,
            pol,
            pod,
            route,
            transhipmentPorts,
            qty,
            packageType,
            weight,
            cbm,
            incoterm,
            bookingConfirmed,
            status,
            hawb,
            mawb,
            remark,
            legEtd1,
            legAtd1,
            legEta1,
            legAta1,
            legEtd2,
            legAtd2,
            legEta2,
            legAta2,
            carrier,
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
