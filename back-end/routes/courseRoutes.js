import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import { teacherWriteLimiter, studentReadLimiter } from '../middlewares/rateLimiter.js';
import {
    validateCreateCourse,
    validateUpdateCourse,
} from '../middlewares/validationMiddleware.js';

export const createCourseRouter = (courseController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/', roleMiddleware(['teacher']), teacherWriteLimiter, validateCreateCourse, courseController.create);

    // Cache course list for 60s — high read frequency, rarely changes
    router.get('/', studentReadLimiter, cacheMiddleware(60), courseController.getAll);

    // Cache individual course for 30s
    router.get('/:courseId', studentReadLimiter, cacheMiddleware(30), courseController.getOne);

    // Curriculum changes only when teacher edits — cache 30s
    router.get('/:courseId/curriculum', studentReadLimiter, cacheMiddleware(30), courseController.getCurriculum);

    router.patch('/:courseId', roleMiddleware(['teacher']), teacherWriteLimiter, validateUpdateCourse, courseController.update);
    router.delete('/:courseId', roleMiddleware(['teacher']), teacherWriteLimiter, courseController.delete);

    router.patch('/:courseId/publish', roleMiddleware(['teacher']), teacherWriteLimiter, courseController.publish);
    router.patch('/:courseId/unpublish', roleMiddleware(['teacher']), teacherWriteLimiter, courseController.unpublish);

    return router;
};