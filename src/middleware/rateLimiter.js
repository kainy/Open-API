const { RedisClient } = require('../utils/redis');
const { logger } = require('../utils/logger');

const RATE_LIMIT_WINDOW = 60; // 1 minute window
const MAX_REQUESTS = 100;     // Maximum requests per window

exports.rateLimiter = async (ctx, next) => {
  const apiKey = ctx.get('X-API-Key');
  if (!apiKey) {
    ctx.status = 401;
    ctx.body = { error: 'API key required' };
    return;
  }

  const key = `ratelimit:${apiKey}`;
  
  try {
    const [requests] = await RedisClient
      .multi()
      .incr(key)
      .expire(key, RATE_LIMIT_WINDOW)
      .exec();

    const requestCount = requests[1];

    ctx.set('X-RateLimit-Limit', MAX_REQUESTS);
    ctx.set('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - requestCount));

    if (requestCount > MAX_REQUESTS) {
      ctx.status = 429;
      ctx.body = { error: 'Rate limit exceeded' };
      return;
    }

    await next();
  } catch (error) {
    logger.error('Rate limiter error:', error);
    await next(); // Proceed even if rate limiting fails
  }
};
