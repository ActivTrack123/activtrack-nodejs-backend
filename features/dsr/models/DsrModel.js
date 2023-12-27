const mongoose = require('mongoose');
const { PortDataDischargeStatus } = require('../../../config/constants');

const Schema = mongoose.Schema;

/**
 * Port Data Discharge Schema for DSR
 */
const DSRSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    kam: {
        type: String,
        trim: true,
    },
    bookingReference: {
        type: String,
        trim: true,
    },
    super: {
        type: String,
        trim: true,
    },
    consignee: {
        type: String,
        trim: true,
    },
    merchandiser: {
        type: String,
        trim: true,
    },
    pos: {
        type: String,
        trim: true,
    },
    shipmentType: {
        type: String,
        trim: true,
    },
    cfs1: {
        type: Date,
    },
    voyage: {
        type: String,
        trim: true,
    },
    customerReference: {
        type: String,
        trim: true,
    },
    qty: {
        type: String,
        trim: true,
    },
    transhipmentPorts: {
        type: String,
        trim: true,
    },
    etd: {
        type: Date,
    },
    agentReference: {
        type: String,
        trim: true,
    },
    packageType: {
        type: String,
        trim: true,
    },
    vessel: {
        name: {
            type: String,
            trim: true,
        },
    },
    atd: {
        type: Date,
    },
    originAgent: {
        type: String,
        trim: true,
    },
    weight: {
        type: String,
        trim: true,
    },
    voyage2: {
        type: String,
        trim: true,
    },
    eta: {
        type: Date,
    },
    cargoReadyDate: {
        type: Date,
    },
    cbm: {
        type: String,
        trim: true,
    },
    legEtd: {
        type: Date,
    },
    ata: {
        type: Date,
    },
    bookingType: {
        type: String,
        trim: true,
    },
    gp: {
        type: String,
        trim: true,
    },
    legAtd: {
        type: Date,
    },
    mblNo: {
        type: String,
        trim: true,
    },
    portReceipt: {
        type: String,
        trim: true,
    },
    hc: {
        type: String,
        trim: true,
    },
    legEta: {
        type: Date,
    },
    hblNo: {
        type: String,
        trim: true,
    },
    portOfLoading: {
        type: String,
        trim: true,
    },
    incoterm: {
        type: String,
        trim: true,
    },
    legAta: {
        type: Date,
    },
    containerNumber: {
        type: String,
        trim: true,
    },
    portOfDischarge: {
        type: String,
        trim: true,
    },
    bookingConfirmed: {
        type: Date,
    },
    cfsCutOff: {
        type: Date,
    },
    devaning: {
        type: String,
        trim: true,
    },
    route: {
        type: String,
        trim: true,
    },
    cargoReceived: {
        type: Date,
    },
    vessel1: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        trim: true,
        required: true,
        default: PortDataDischargeStatus.INACTIVE,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('DSR', DSRSchema);
