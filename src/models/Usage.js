const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  endpoint: { type: String, required: true },
  requestCount: { type: Number, default: 1 },
  cost: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  billingPeriod: { 
    year: { type: Number, required: true },
    month: { type: Number, required: true }
  }
});

// Create compound index for efficient querying
usageSchema.index({ userId: 1, 'billingPeriod.year': 1, 'billingPeriod.month': 1 });

module.exports = mongoose.model('Usage', usageSchema);
