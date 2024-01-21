const mongoose = require('mongoose');

const VesselScheduleSchema = new mongoose.Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    portOfReceipt: { type: String, default: '' },
    portOfLoading: { type: String, default: '' },
    vesselName: { type: String, default: '' },
    voyage: { type: String, default: '' },
    bkgCutoff: { type: Date,  },
    cfsCutoff1: { type: Date,  },
    cyCutoff1: { type: Date,  },
    etd1: { type: Date,  },
    ata1: { type: Date,  },
    eta1: { type: Date,  },
    atd1: { type: Date,  },
    portOfDischarge: { type: String, default: '' },
    tsPort: { type: String, default: '_' },
    connectingVessel: { type: String, default: '' },
    voyage2: { type: String, default: '' },
    cfsCutoff2: { type: Date,  },
    cyCutoff2: { type: Date,  },
    etd2: { type: Date,  },
    atd2: { type: Date,  },
    eta2: { type: Date,  },
    ata2: { type: Date,  },
    service: { type: String, default: '' },
    carrier: { type: String, default: '' },
    note: { type: String, default: '' },
    createdBy:{type : String , trim: true},
    updatedBy:{type : String , trim: true}
})
module.exports = mongoose.model('VesselSchedule', VesselScheduleSchema);

