const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  apiKey: { type: String, required: true, unique: true },
  billingPlan: {
    type: String,
    enum: ['monthly', 'usage'],
    required: true
  },
  monthlyQuota: { type: Number },  // For monthly plan
  usageRate: { type: Number },     // For usage-based plan
  balance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
