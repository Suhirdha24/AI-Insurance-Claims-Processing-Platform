import Redis from 'ioredis';
import { config } from './env';

export const redisClient = new Redis(config.redisUrl, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
  retryStrategy(times) {
    // Retry every 10 seconds without crashing Express API
    return Math.min(times * 1000, 10000);
  },
});

redisClient.on('connect', () => {
  console.log('[Redis] Connected successfully');
});

redisClient.on('error', (err) => {
  // Gracefully handle offline Redis without crashing the API
  if (err.message.includes('ECONNREFUSED')) {
    // Friendly status message
  } else {
    console.error('[Redis Error]:', err.message);
  }
});
