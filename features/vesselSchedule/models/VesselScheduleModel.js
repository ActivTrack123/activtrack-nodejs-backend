const mongoose = require('mongoose');

const VesselScheduleSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    portOfReceipt: { type: String, default: '' },
    portOfLoading: { type: String, default: '' },
    vesselName: { type: String, default: '' },
    voyage: { type: String, default: '' },
    bkgCutoff: { type: Date, default: new Date() },
    cfsCutoff1: { type: Date, default: new Date() },
    cyCutoff1: { type: Date, default: new Date() },
    etd1: { type: Date, default: new Date() },
    ata1: { type: Date, default: new Date() },
    eta1: { type: Date, default: new Date() },
    ataPod1: { type: Date, default: new Date() },
    portOfDischarge: { type: String, default: '' },
    tsPort: { type: String, default: '_' },
    connectingVessel: { type: String, default: '' },
    voyage2: { type: String, default: '' },
    cfsCutoff2: { type: Date, default: new Date() },
    cyCutoff2: { type: Date, default: new Date() },
    etd2: { type: Date, default: new Date() },
    atd2: { type: Date, default: new Date() },
    eta2: { type: Date, default: new Date() },
    ata2: { type: Date, default: new Date() },
    service: { type: String, default: '' },
    carrier: { type: String, default: '' },
    note: { type: String, default: '' },
    createdBy:{type : String , trim: true},
    updatedBy:{type : String , trim: true}
})
module.exports = mongoose.model('VesselSchedule', VesselScheduleSchema);

