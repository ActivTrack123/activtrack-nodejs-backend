const mongoose = require('mongoose');
const { PortDataDischargeStatus } = require('../../../config/constants');

const Schema = mongoose.Schema;

/**
 * Customer Schema
 */
const PortDataDischargeSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true
    },
   
    status: {
        type: String,
        required: true,
        default: PortDataDischargeStatus.INACTIVE
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('PortDataDischarge', PortDataDischargeSchema);