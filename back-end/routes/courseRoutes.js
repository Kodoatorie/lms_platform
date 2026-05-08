import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createCourseRouter = (courseController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/', roleMiddleware(['teacher']), courseController.create);
    router.get('/', courseController.getAll);
    router.get('/:courseId', courseController.getOne);
    router.patch('/:courseId', roleMiddleware(['teacher']), courseController.update);
    router.delete('/:courseId', roleMiddleware(['teacher']), courseController.delete);
    return router;
};