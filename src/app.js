require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const { logger } = require('./utils/logger');
const apiRoutes = require('./routes/api');
const billingRoutes = require('./routes/billing');

const app = new Koa();
const router = new Router();

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Middleware
app.use(errorHandler);
app.use(bodyParser());
app.use(rateLimiter);

// Routes
router.use('/api', apiRoutes.routes());
router.use('/billing', billingRoutes.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
