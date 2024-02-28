const mongoose = require('mongoose');

const MerchandiserSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    _id: { type: String, trim: true },

    status: { type: String, trim: true, default: 'Active' },
    created: { type: Date, default: Date.now },
});

const AirFreightSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    kam: { type: String, trim: true },
    bookingReceived: { type: Date },
    shipper: { type: String, trim: true },
    consignee: { type: String, trim: true },
    merchandisers: { type: [MerchandiserSchema], default: [] },//{ type: String, trim: true },
    bookingReference: { type: String, trim: true, unique: true },
    customerReference: { type: String, trim: true },
    airline: { type: String, trim: true },
    cargoReadyDate: { type: Date },
    pol: { type: String, trim: true },
    pod: { type: String, trim: true },
    route: { type: String, trim: true },
    transhipmentPorts:{type: String},
    qty: {type: Number,default: 0},
    packageType: { type: String, trim: true },
    weight: { type: String, trim: true },
    cbm: { type: Number, trim: true },
    incoterm: { type: String, trim: true },
    bookingConfirmed: { type: Date },
    status: { type: String, trim: true },
    hawb: { type: String, trim: true },
    mawb: { type: String, trim: true },
    remark: { type: String, trim: true },
    legEtd1: { type: Date },
    legAtd1: { type: Date },
    legEta1: { type: Date },
    legAta1: { type: Date },
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



module.exports = mongoose.model('AirFreight', AirFreightSchema);

