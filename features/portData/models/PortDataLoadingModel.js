const mongoose = require('mongoose');
const { PortDataLoadingStatus } = require('../../../config/constants');

const Schema = mongoose.Schema;

/**
 * Customer Schema
 */
const PortDataLoadingSchema = new Schema({
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
        default: PortDataLoadingStatus.INACTIVE
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('PortDataLoading', PortDataLoadingSchema);