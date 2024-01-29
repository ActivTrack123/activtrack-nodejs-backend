const mongoose = require('mongoose');
const { VesselStatus } = require('../../../config/constants');

const Schema = mongoose.Schema;

/**
 * Customer Schema
 */
const VesselSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    lat: {
        type: Number,
        required: true,
    },
    lng: {
        type: Number,
        required: true,
    },
    action: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: true,
        default: VesselStatus.INACTIVE
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Vessel', VesselSchema);