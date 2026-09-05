import Redis from 'ioredis';
import { config } from './env';

export const redisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  enableOfflineQueue: false,
  retryStrategy() {
    return 10000;
  },
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redisClient.on('error', () => {
  // Silent catch when Redis is offline during local dev
});
