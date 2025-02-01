const Router = require('koa-router');
const BillingService = require('../services/BillingService');
const { validateApiKey } = require('../middleware/auth');

const router = new Router();

// Get monthly usage statistics
router.get('/usage/:year/:month', validateApiKey, async (ctx) => {
  const { year, month } = ctx.params;
  const usage = await BillingService.getMonthlyUsage(
    ctx.state.user._id,
    parseInt(year),
    parseInt(month)
  );
  ctx.body = { usage };
});

// Get monthly bill
router.get('/bill/:year/:month', validateApiKey, async (ctx) => {
  const { year, month } = ctx.params;
  const bill = await BillingService.generateMonthlyBill(
    ctx.state.user._id,
    parseInt(year),
    parseInt(month)
  );
  ctx.body = { bill };
});

// Update billing plan
router.put('/plan', validateApiKey, async (ctx) => {
  const { billingPlan, monthlyQuota, usageRate } = ctx.request.body;
  const user = await User.findByIdAndUpdate(
    ctx.state.user._id,
    {
      billingPlan,
      monthlyQuota,
      usageRate,
      updatedAt: new Date()
    },
    { new: true }
  );
  ctx.body = { user };
});

module.exports = router;
