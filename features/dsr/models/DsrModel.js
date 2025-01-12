const mongoose = require('mongoose');

const MerchandiserSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    _id: { type: String, trim: true },

    status: { type: String, trim: true, default: 'Active' },
    created: { type: Date, default: Date.now },
});

const DSRSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    kam: { type: String, trim: true },
    bookingReference: { type: String, trim: true, unique: true },
    shipper: { type: String, trim: true },
    consignee: { type: String, trim: true },
    merchandisers: { type: [MerchandiserSchema], default: [] },//{ type: String, trim: true },
    bookingReceived: { type: Date },
    shipper: { type: String, trim: true },
    pos: { type: String, trim: true },
    customerReference: { type: String, trim: true },
    agentReference: { type: String, trim: true },
    originAgent: { type: String, trim: true },
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
    cbm: { type: Number, trim: true },
    voyage1: { type: String, trim: true },
    vessel1: { type: String, trim: true },
    legEtd1: { type: Date },
    legAtd1: { type: Date },
    legEta1: { type: Date },
    legAta1: { type: Date },
    transhipmentPorts:{type: String},
    cfs2: { type: Date },
    qty: {type: Number, default: 0},
    voyage2: { type: String, trim: true },
    vessel2: { type: String, trim: true },
    legEtd2: { type: Date },
    legAtd2: { type: Date },
    legEta2: { type: Date },
    legAta2: { type: Date },
    carrier: { type: String, default: '' },
    created: { type: Date, default: Date.now },
    createdBy:{type : String , trim: true},
    updatedBy:[
        {type : String , trim: true}
    ],
    percentage: {
        type: Number,
        default: 0,
      },
});



module.exports = mongoose.model('DSR', DSRSchema);

