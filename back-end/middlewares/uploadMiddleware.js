// middlewares/uploadMiddleware.js
import multer from 'multer';
import config from '../config/index.js';
import { logger } from '../utils/logger.js';

// Use memory storage — files go straight to MinIO, never hit disk
const storage = multer.memoryStorage();

function makeFilter(allowedMimeTypes) {
    return (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type "${file.mimetype}" is not allowed.`), false);
        }
    };
}

// ── Course cover (public bucket) ──────────────────────────────────────────────
export const uploadCourseCover = multer({
    storage,
    limits: { fileSize: config.upload.maxCoverSize },
    fileFilter: makeFilter(config.upload.allowedCoverTypes),
}).single('cover');

// ── Lesson materials (private bucket) ─────────────────────────────────────────
export const uploadLessonMaterial = multer({
    storage,
    limits: { fileSize: config.upload.maxMaterialSize },
    fileFilter: makeFilter(config.upload.allowedMaterialTypes),
}).single('file');

// ── Homework submission (private bucket) ─────────────────────────────────────
export const uploadSubmissionFile = multer({
    storage,
    limits: { fileSize: config.upload.maxSubmissionSize },
    fileFilter: makeFilter(config.upload.allowedMaterialTypes),
}).single('file');

// ── Error handler wrapper (turns multer errors into 400 responses) ────────────
export function handleMulterError(uploadFn) {
    return (req, res, next) => {
        uploadFn(req, res, (err) => {
            if (!err) return next();
            logger.warn('[Upload] Multer error', { message: err.message, user: req.user?.id });
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(413).json({ error: 'File too large', details: err.message });
                }
                return res.status(400).json({ error: 'Upload error', details: err.message });
            }
            return res.status(400).json({ error: err.message });
        });
    };
}
