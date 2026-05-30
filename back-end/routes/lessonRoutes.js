import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createLessonRouter = (lessonController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/modules/:moduleId/lessons', roleMiddleware(['teacher']), lessonController.create);
    router.get('/modules/:moduleId/lessons', lessonController.getByModule);
    router.get('/lessons/:lessonId', lessonController.getOne);
    router.patch('/lessons/:lessonId', roleMiddleware(['teacher']), lessonController.update);
    router.delete('/lessons/:lessonId', roleMiddleware(['teacher']), lessonController.delete);
    return router;
};