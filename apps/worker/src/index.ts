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
    console.warn('[Worker Warning] MongoDB connection pending or offline:', err.message);
  }

  const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      return Math.min(times * 1000, 10000);
    },
  });

  redisConnection.on('error', (err) => {
    if (err.message.includes('ECONNREFUSED')) {
      // Suppress spammy offline trace
    } else {
      console.error('[Worker Redis Error]:', err.message);
    }
  });

  const worker = new Worker(
    'claim-processing-queue',
    async (job) => {
      console.log(`[Worker] Received job: ${job.name} (ID: ${job.id})`);
      if (job.name === 'process-claim-pipeline') {
        await processClaimPipeline(job.data.claimId);
      }
    },
    { connection: redisConnection }
  );

  worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed:`, err);
  });

  console.log('=================================================');
  console.log('  AI Insurance Platform Background Worker Active');
  console.log('=================================================');
}

startWorker().catch((err) => {
  console.error('[Worker Error]:', err);
});
