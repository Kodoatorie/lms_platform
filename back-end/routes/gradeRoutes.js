import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createGradeRouter = (gradeController) => {
    const router = Router();
    router.use(authMiddleware);
    // Grade a specific submission
    router.post('/submissions/:submissionId/grade', roleMiddleware(['teacher']), gradeController.grade);
    router.get('/submissions/:submissionId/grade', gradeController.getGrade);
    // All submissions across a course (for grading page)
    router.get('/courses/:courseId/submissions', roleMiddleware(['teacher']), gradeController.getCourseSubmissions);
    return router;
};