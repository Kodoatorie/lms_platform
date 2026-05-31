import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { validateGrade } from '../middlewares/validationMiddleware.js';

export const createGradeRouter = (gradeController) => {
    const router = Router();
    router.use(authMiddleware);

    router.post('/submissions/:submissionId/grade',     roleMiddleware(['teacher']), validateGrade, gradeController.grade);
    router.get('/submissions/:submissionId/grade',      gradeController.getGrade);
    router.get('/courses/:courseId/submissions',        roleMiddleware(['teacher']), gradeController.getCourseSubmissions);

    return router;
};