import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createSubmissionRouter = (submissionController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/assignments/:assignmentId/submit', submissionController.submit);
    router.get('/assignments/:assignmentId/my-submission', submissionController.getMySubmission);
    router.get('/assignments/:assignmentId/submissions', roleMiddleware(['teacher']), submissionController.getAllForTeacher);
    return router;
};