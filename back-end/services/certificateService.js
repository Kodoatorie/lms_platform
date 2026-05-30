import { generateVerificationCode } from '../utils/generateCode.js';
import { generateCertificatePdf } from '../utils/pdfGenerator.js';
import { addCertificateJob } from '../lib/queues.js';

export class CertificateService {
    constructor(certificateModel, enrollmentModel, courseModel, userModel, studentProfileModel) {
        this.certificateModel = certificateModel;
        this.enrollmentModel = enrollmentModel;
        this.courseModel = courseModel;
        this.userModel = userModel;
        this.studentProfileModel = studentProfileModel;
    }

    async generateCertificate(userId, courseId) {
        // 1. Verify the course is completed
        const enrollment = await this.enrollmentModel.findOne(userId, courseId);
        if (!enrollment || enrollment.status !== 'completed') {
            throw new Error('Course not completed');
        }

        // 2. Return existing certificate if already issued
        const existing = await this.certificateModel.findByUserAndCourse(userId, courseId);
        if (existing) return existing;

        // 3. Generate synchronously so the student gets it immediately
        const user = await this.userModel.findById(userId);
        const course = await this.courseModel.findById(courseId);

        // Prefer student profile full_name
        let fullName = user.email;
        try {
            const profile = await this.studentProfileModel?.findByUserId(userId);
            if (profile?.full_name) fullName = profile.full_name;
        } catch { /* ignore */ }

        const code = generateVerificationCode();
        const pdfUrl = await generateCertificatePdf(
            fullName,
            course.title,
            new Date().toISOString(),
            code
        );

        const cert = await this.certificateModel.create({
            userId,
            courseId,
            pdfUrl,
            verificationCode: code,
        });

        return cert;
    }

    async getUserCertificates(userId) {
        return this.certificateModel.findByUser(userId);
    }

    async verifyCertificate(code) {
        return this.certificateModel.findByCode(code);
    }
}