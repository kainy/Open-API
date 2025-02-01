const Redis = require('redis');
const { logger } = require('./logger');

class RedisClient {
  static client = null;

  static async connect() {
    if (!this.client) {
      this.client = Redis.createClient({
        url: process.env.REDIS_URL
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      this.client.on('connect', () => {
        logger.info('Connected to Redis');
      });

      await this.client.connect();
    }
    return this.client;
  }

  static async get(key) {
    const client = await this.connect();
    return client.get(key);
  }

  static async set(key, value, expireSeconds = null) {
    const client = await this.connect();
    if (expireSeconds) {
      return client.setEx(key, expireSeconds, value);
    }
    return client.set(key, value);
  }

  static async hincrby(key, field, increment) {
    const client = await this.connect();
    return client.hIncrBy(key, field, increment);
  }

  static async expire(key, seconds) {
    const client = await this.connect();
    return client.expire(key, seconds);
  }
}

module.exports = { RedisClient };
