import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import {
    validateCreateCourse,
    validateUpdateCourse,
} from '../middlewares/validationMiddleware.js';

export const createCourseRouter = (courseController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/',                  roleMiddleware(['teacher']), validateCreateCourse, courseController.create);
    router.get('/',                   courseController.getAll);
    router.get('/:courseId',          courseController.getOne);
    router.get('/:courseId/curriculum', courseController.getCurriculum);
    router.patch('/:courseId',        roleMiddleware(['teacher']), validateUpdateCourse, courseController.update);
    router.delete('/:courseId',       roleMiddleware(['teacher']), courseController.delete);

    return router;
};