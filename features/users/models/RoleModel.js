const mongoose = require('mongoose');

const Schema = mongoose.Schema

/**
 * Document Schema
 */
const RoleSchema = new Schema({
    _id: mongoose.SchemaTypes.ObjectId,
    name: {
        type: String,
        trim: true,
        required: true,
    },
    rolePermissions: [{ type: mongoose.Types.ObjectId, ref: "RolePermission"}],
    created: {
        type: Date,
        default: Date.now
    },
});

// RoleSchema.virtual('rolePermissions', {
//     ref: 'RolePermission',
//     localField: '_id',
//     foreignField: 'role',
//     justOne: false // set true for one-to-one relationship
// })

module.exports = mongoose.model('Role', RoleSchema);
