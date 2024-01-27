const mongoose = require('mongoose');
const { PortDataReceiptStatus } = require('../../../config/constants');

const Schema = mongoose.Schema;

/**
 * Customer Schema
 */
const PortDataReceiptSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
   
    status: {
        type: String,
        required: true,
        default: PortDataReceiptStatus.INACTIVE
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('PortDataReceipt', PortDataReceiptSchema);