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
  await mongoose.connect(mongoUri);

  const redisConnection = new Redis(redisUrl, { maxRetriesPerRequest: null });

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
  console.error('[Worker] Failure starting background worker:', err);
  process.exit(1);
});
