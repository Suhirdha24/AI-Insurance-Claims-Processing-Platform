import { Worker } from 'bullmq';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { processClaimPipeline } from './handlers/claimPipelineHandler';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_insurance_claims';
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

async function startWorker() {
  console.log('[Worker] Connecting to MongoDB...');
  try {
    await mongoose.connect(mongoUri);
    console.log('[Worker] Connected to MongoDB');
  } catch (err: any) {
    console.warn('[Worker Warning] MongoDB connection pending or offline');
  }

  const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    retryStrategy(times) {
      // Retry silently every 10 seconds
      return 10000;
    },
  });

  // Completely suppress repetitive offline log noise
  redisConnection.on('error', (err) => {
    // Silent catch when Redis server is offline
  });

  const worker = new Worker(
    'claim-processing-queue',
    async (job) => {
      console.log(`[Worker] Received job: ${job.name} (ID: ${job.id})`);
      if (job.name === 'process-claim-pipeline') {
        await processClaimPipeline(job.data.claimId);
      }
    },
    {
      connection: redisConnection,
    }
  );

  worker.on('error', (err) => {
    // Silent catch when BullMQ queue attempts connection
  });

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
  });

  console.log('=================================================');
  console.log('  AI Insurance Platform Background Worker Active');
  console.log('  (Queue processing active when Redis is online)');
  console.log('=================================================');
}

startWorker().catch(() => {});
