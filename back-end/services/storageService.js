// services/storageService.js
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import {
    uploadObject, deleteObject, getPresignedUrl, getPublicUrl,
    BUCKETS,
} from '../lib/minio.js';
import { logger } from '../utils/logger.js';

export class StorageService {
    constructor(fileModel) {
        this.fileModel = fileModel;   // FileModel for metadata persistence
    }

    // ── Course cover (public) ────────────────────────────────────────────────

    async uploadCourseCover(courseId, file, uploadedBy) {
        const ext        = path.extname(file.originalname).toLowerCase();
        const objectName = `courses/${courseId}/cover${ext}`;

        await uploadObject(
            BUCKETS.PUBLIC,
            objectName,
            file.buffer,
            file.size,
            file.mimetype,
        );

        const publicUrl = getPublicUrl(objectName);

        // Persist metadata
        const record = await this.fileModel.upsertCourseCover({
            courseId,
            bucket:      BUCKETS.PUBLIC,
            objectName,
            originalName: file.originalname,
            mimeType:    file.mimetype,
            size:        file.size,
            publicUrl,
            uploadedBy,
        });

        logger.info('[Storage] Course cover uploaded', { courseId, objectName, uploadedBy });
        return record;
    }

    // ── Lesson material (private) ────────────────────────────────────────────

    async uploadLessonMaterial(lessonId, courseId, file, uploadedBy) {
        const ext        = path.extname(file.originalname).toLowerCase();
        const uid        = uuidv4();
        const objectName = `courses/${courseId}/lessons/${lessonId}/${uid}${ext}`;

        await uploadObject(
            BUCKETS.PRIVATE,
            objectName,
            file.buffer,
            file.size,
            file.mimetype,
        );

        const record = await this.fileModel.create({
            courseId,
            lessonId,
            bucket:       BUCKETS.PRIVATE,
            objectName,
            originalName: file.originalname,
            mimeType:     file.mimetype,
            size:         file.size,
            fileType:     'lesson_material',
            uploadedBy,
        });

        logger.info('[Storage] Lesson material uploaded', { lessonId, objectName, uploadedBy });
        return record;
    }

    // ── Submission file (private) ────────────────────────────────────────────

    async uploadSubmissionFile(submissionId, courseId, file, uploadedBy) {
        const ext        = path.extname(file.originalname).toLowerCase();
        const uid        = uuidv4();
        const objectName = `submissions/${courseId}/${submissionId}/${uid}${ext}`;

        await uploadObject(
            BUCKETS.PRIVATE,
            objectName,
            file.buffer,
            file.size,
            file.mimetype,
        );

        const record = await this.fileModel.create({
            courseId,
            submissionId,
            bucket:       BUCKETS.PRIVATE,
            objectName,
            originalName: file.originalname,
            mimeType:     file.mimetype,
            size:         file.size,
            fileType:     'submission',
            uploadedBy,
        });

        logger.info('[Storage] Submission file uploaded', { submissionId, objectName, uploadedBy });
        return record;
    }

    // ── Generate presigned download URL ────────────────────────────────────────

    async getDownloadUrl(fileId, requesterId, requesterRole) {
        const record = await this.fileModel.findById(fileId);
        if (!record) throw new Error('File not found');

        // Access check: only enrolled students, the teacher, or admin
        if (record.bucket === BUCKETS.PRIVATE) {
            if (requesterRole !== 'admin' &&
                Number(record.uploaded_by) !== Number(requesterId)) {
                // Allow if requester is the course teacher or enrolled — caller must verify
                // (See FileController for full auth logic)
            }
        }

        const url = record.bucket === BUCKETS.PUBLIC
            ? record.public_url
            : await getPresignedUrl(record.bucket, record.object_name, 3600);

        logger.info('[Storage] Download URL generated', { fileId, requesterId, bucket: record.bucket });
        return { url, expiresIn: record.bucket === BUCKETS.PUBLIC ? null : 3600 };
    }

    // ── Delete file ────────────────────────────────────────────────────────────

    async deleteFile(fileId, requesterId, requesterRole) {
        const record = await this.fileModel.findById(fileId);
        if (!record) throw new Error('File not found');

        if (requesterRole !== 'admin' && Number(record.uploaded_by) !== Number(requesterId)) {
            throw new Error('Not authorized');
        }

        await deleteObject(record.bucket, record.object_name);
        await this.fileModel.delete(fileId);
        logger.info('[Storage] File deleted', { fileId, requesterId });
        return true;
    }

    // ── List files for a lesson ───────────────────────────────────────────────

    async getLessonFiles(lessonId) {
        return this.fileModel.findByLesson(lessonId);
    }
}
