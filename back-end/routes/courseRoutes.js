import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { cacheMiddleware } from '../middlewares/cacheMiddleware.js';
import {
    validateCreateCourse,
    validateUpdateCourse,
} from '../middlewares/validationMiddleware.js';

export const createCourseRouter = (courseController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/', roleMiddleware(['teacher']), validateCreateCourse, courseController.create);

    // Cache course list for 60s — high read frequency, rarely changes
    router.get('/', cacheMiddleware(60), courseController.getAll);

    // Cache individual course for 30s
    router.get('/:courseId', cacheMiddleware(30), courseController.getOne);

    // Curriculum changes only when teacher edits — cache 30s
    router.get('/:courseId/curriculum', cacheMiddleware(30), courseController.getCurriculum);

    router.patch('/:courseId', roleMiddleware(['teacher']), validateUpdateCourse, courseController.update);
    router.delete('/:courseId', roleMiddleware(['teacher']), courseController.delete);

    return router;
};