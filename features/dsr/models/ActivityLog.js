const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
    changeType: { type: String, required: true }, // 'insert', 'update', 'delete'
    documentId: { type: mongoose.SchemaTypes.ObjectId, required: true },// Add dsr_id
    changeBy: { type: String, required: false }, // Add changeBy
    changeDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    timestamp: { type: Date, default: Date.now },
});

const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

module.exports = ActivityLog;
