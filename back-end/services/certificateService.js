import { generateVerificationCode } from '../utils/generateCode.js';
import { generateCertificatePdf } from '../utils/pdfGenerator.js';
import { addCertificateJob } from '../lib/queues.js';

export class CertificateService {
    constructor(certificateModel, enrollmentModel, courseModel, userModel) {
        this.certificateModel = certificateModel;
        this.enrollmentModel = enrollmentModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
    }

    async generateCertificate(userId, courseId, backgroundJob = true) {
        // Проверить, завершён ли курс
        const enrollment = await this.enrollmentModel.findOne(userId, courseId);
        if (!enrollment || enrollment.status !== 'completed') {
            throw new Error('Course not completed');
        }
        const existing = await this.certificateModel.findByUserAndCourse(userId, courseId);
        if (existing) return existing;
        if (backgroundJob) {
            const job = await addCertificateJob(userId, courseId);
            return { message: 'Certificate generation queued', jobId: job.id };
        } else {
            // Синхронная генерация (для тестов или немедленного получения)
            const user = await this.userModel.findById(userId);
            const course = await this.courseModel.findById(courseId);
            const code = generateVerificationCode();
            const pdfUrl = await generateCertificatePdf(user.full_name, course.title, new Date().toISOString(), code);
            const cert = await this.certificateModel.create({ userId, courseId, pdfUrl, verificationCode: code });
            return cert;
        }
    }

    async getUserCertificates(userId) {
        return this.certificateModel.findByUser(userId);
    }

    async verifyCertificate(code) {
        return this.certificateModel.findByCode(code);
    }
}