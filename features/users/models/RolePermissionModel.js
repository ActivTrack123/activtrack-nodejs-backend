const mongoose = require('mongoose');

const Schema = mongoose.Schema

/**
 * Document Schema
 */
const RolePermissionSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    permission: { type: mongoose.Types.ObjectId, ref: "Permission"},
    role: { type: mongoose.Types.ObjectId, ref: "Role"},
    create: {
        type: Boolean,
        required: true,
        default: false,
    },
    read: {
        type: Boolean,
        required: true,
        default: false,
    },
    update: {
        type: Boolean,
        required: true,
        default: false,
    },
    delete: {
        type: Boolean,
        required: true,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('RolePermission', RolePermissionSchema);
