const mongoose = require('mongoose');

const Schema = mongoose.Schema

/**
 * Document Schema
 */
const PermissionSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Permission', PermissionSchema);
