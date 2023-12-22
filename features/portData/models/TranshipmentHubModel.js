const mongoose = require('mongoose');
const { TranshipmentHubStatus } = require('../../../config/constants');

const Schema = mongoose.Schema;

/**
 * Customer Schema
 */
const TranshipmentHubSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true
    },
   
    status: {
        type: String,
        required: true,
        default: TranshipmentHubStatus.INACTIVE
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('TranshipmentHub', TranshipmentHubSchema);