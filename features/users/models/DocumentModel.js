const mongoose = require('mongoose');

const Schema = mongoose.Schema

/**
 * Document Schema
 */
const DocumentSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    fileUrl: {
        type: String,
        trim: true,
        required: false,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Document', DocumentSchema);
