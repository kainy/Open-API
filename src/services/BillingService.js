const moment = require('moment');
const User = require('../models/User');
const Usage = require('../models/Usage');
const { logger } = require('../utils/logger');
const { RedisClient } = require('../utils/redis');

class BillingService {
  static async recordUsage(userId, endpoint) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.isActive) {
        throw new Error('Invalid or inactive user');
      }

      const now = moment();
      const year = now.year();
      const month = now.month() + 1;

      // Calculate cost based on billing plan
      let cost = 0;
      if (user.billingPlan === 'usage') {
        cost = user.usageRate;
      }

      // Check monthly quota for monthly plan
      if (user.billingPlan === 'monthly') {
        const monthlyUsage = await Usage.aggregate([
          {
            $match: {
              userId: user._id,
              'billingPeriod.year': year,
              'billingPeriod.month': month
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$requestCount' }
            }
          }
        ]);

        const currentUsage = monthlyUsage[0]?.total || 0;
        if (currentUsage >= user.monthlyQuota) {
          throw new Error('Monthly quota exceeded');
        }
      }

      // Record usage with Redis for performance
      const usageKey = `usage:${userId}:${year}:${month}:${endpoint}`;
      await RedisClient.hincrby(usageKey, 'count', 1);
      await RedisClient.expire(usageKey, 60 * 60 * 24 * 7); // Expire after 7 days

      // Persist to MongoDB asynchronously
      const usage = await Usage.findOneAndUpdate(
        {
          userId,
          endpoint,
          'billingPeriod.year': year,
          'billingPeriod.month': month
        },
        {
          $inc: { requestCount: 1 },
          $set: { cost }
        },
        { upsert: true, new: true }
      );

      // Update user balance for usage-based billing
      if (user.billingPlan === 'usage') {
        await User.findByIdAndUpdate(userId, {
          $inc: { balance: -cost }
        });
      }

      return usage;
    } catch (error) {
      logger.error('Error recording usage:', error);
      throw error;
    }
  }

  static async getMonthlyUsage(userId, year, month) {
    try {
      const usage = await Usage.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            'billingPeriod.year': year,
            'billingPeriod.month': month
          }
        },
        {
          $group: {
            _id: '$endpoint',
            totalRequests: { $sum: '$requestCount' },
            totalCost: { $sum: { $multiply: ['$requestCount', '$cost'] } }
          }
        }
      ]);

      return usage;
    } catch (error) {
      logger.error('Error getting monthly usage:', error);
      throw error;
    }
  }

  static async generateMonthlyBill(userId, year, month) {
    try {
      const user = await User.findById(userId);
      const usage = await this.getMonthlyUsage(userId, year, month);
      
      let totalCost = 0;
      if (user.billingPlan === 'monthly') {
        totalCost = user.monthlyQuota > 0 ? user.usageRate : 0;
      } else {
        totalCost = usage.reduce((sum, item) => sum + item.totalCost, 0);
      }

      return {
        userId,
        billingPlan: user.billingPlan,
        year,
        month,
        usage,
        totalCost
      };
    } catch (error) {
      logger.error('Error generating monthly bill:', error);
      throw error;
    }
  }
}

module.exports = BillingService;
