import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createGradeRouter = (gradeController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/submissions/:submissionId/grade', roleMiddleware(['teacher']), gradeController.grade);
    router.get('/submissions/:submissionId/grade', gradeController.getGrade);
    return router;
};