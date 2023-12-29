const mongoose = require('mongoose');

const DSRSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    kam: { type: String, trim: true },
    bookingReference: { type: String, trim: true },
    shipper: { type: String, trim: true },
    consignee: { type: String, trim: true },
    merchandiser: { type: String, trim: true },
    bookingReceived: { type: Date },
    shipper: { type: String, trim: true },
    pos: { type: String, trim: true },
    customerReference: { type: String, trim: true },
    agentReference: { type: String, trim: true },
    cargoReadyDate: { type: Date },
    bookingType: { type: String, trim: true },
    por: { type: String, trim: true },
    pol: { type: String, trim: true },
    pod: { type: String, trim: true },
    POR: { type: String, trim: true },
    route: { type: String, trim: true },
    shipmentType: { type: String, trim: true },
    packageType: { type: String, trim: true },
    weight: { type: String, trim: true },
    GP: { type: String, trim: true },
    hc: { type: String, trim: true },
    incoterm: { type: String, trim: true },
    bookingConfirmed: { type: Date },
    cargoReceived: { type: Date },
    mbl: { type: String, trim: true },
    hbl: { type: String, trim: true },
    containerNumber: { type: String, trim: true },
    devanning: { type: String, trim: true },
    status: { type: String, trim: true },
    remark: { type: String, trim: true },
    cfs1: { type: Date },
    voyage1: { type: String, trim: true },
    vessel1: { type: String, trim: true },
    legEtd1: { type: Date },
    legAtd1: { type: Date },
    legEta1: { type: Date },
    legAta1: { type: Date },
    cfs2: { type: Date },
    voyage2: { type: String, trim: true },
    vessel2: { type: String, trim: true },
    legEtd2: { type: Date },
    legAtd2: { type: Date },
    legEta2: { type: Date },
    legAta2: { type: Date },
    created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DSR', DSRSchema);