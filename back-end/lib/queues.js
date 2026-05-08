import { Queue, Worker } from 'bullmq';
import { getBullConnection } from './redis.js';

export const certificateQueue = new Queue('certificate-queue', {
    connection: getBullConnection(),
    defaultJobOptions: { attempts: 3, backoff: { type: 'exponential', delay: 5000 } }
});

export const analyticsQueue = new Queue('analytics-queue', {
    connection: getBullConnection(),
    defaultJobOptions: { attempts: 2 }
});

export const proctoringQueue = new Queue('proctoring-queue', {
    connection: getBullConnection(),
    defaultJobOptions: { attempts: 1, timeout: 60000 }
});

async function processCertificate(data) {
    const { userId, courseId } = data;
    console.log(`[Worker] Generating certificate for user ${userId}, course ${courseId}`);
    // TODO: реальная генерация PDF и сохранение в БД
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ok: true };
}

async function processAnalytics(data) {
    console.log(`[Worker] Analytics job:`, data);
    // Здесь обновление course_stats, user_stats
    return { processed: true };
}

async function processProctoring(data) {
    console.log(`[Worker] Proctoring frame for session ${data.sessionId}`);
    return { processed: true };
}

export function setupWorkers() {
    const certWorker = new Worker('certificate-queue', job => processCertificate(job.data), { connection: getBullConnection() });
    const analyticsWorker = new Worker('analytics-queue', job => processAnalytics(job.data), { connection: getBullConnection() });
    const procWorker = new Worker('proctoring-queue', job => processProctoring(job.data), { connection: getBullConnection() });
    certWorker.on('completed', job => console.log(`✅ Certificate job ${job.id} done`));
    analyticsWorker.on('completed', job => console.log(`✅ Analytics job ${job.id} done`));
    procWorker.on('completed', job => console.log(`✅ Proctoring job ${job.id} done`));
    return { certWorker, analyticsWorker, procWorker };
}

export async function addCertificateJob(userId, courseId) {
    return await certificateQueue.add('generate', { userId, courseId });
}

export async function addAnalyticsJob(type, payload) {
    return await analyticsQueue.add(type, payload);
}