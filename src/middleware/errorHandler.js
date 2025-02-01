const { logger } = require('../utils/logger');

exports.errorHandler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    logger.error('Request error:', err);

    ctx.status = err.status || 500;
    ctx.body = {
      error: {
        message: err.message || 'Internal server error',
        status: ctx.status,
        timestamp: new Date().toISOString()
      }
    };

    // Emit error for potential monitoring
    ctx.app.emit('error', err, ctx);
  }
};
