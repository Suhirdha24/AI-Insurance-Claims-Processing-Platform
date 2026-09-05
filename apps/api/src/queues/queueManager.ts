import { Queue } from 'bullmq';
import { redisClient } from '../config/redis';

export const claimProcessingQueue = new Queue('claim-processing-queue', {
  connection: redisClient,
});

export async function dispatchClaimProcessing(claimId: string) {
  try {
    await claimProcessingQueue.add(
      'process-claim-pipeline',
      { claimId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
      }
    );
    console.log(`[Queue] Dispatched claim-processing-job for Claim ID: ${claimId}`);
  } catch (err) {
    console.error('[Queue Error] Failed to dispatch processing job:', err);
  }
}
