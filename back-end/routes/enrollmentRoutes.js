import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createEnrollmentRouter = (enrollmentController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/courses/:courseId/enroll', enrollmentController.enroll);
    router.get('/me/enrollments', enrollmentController.getMyCourses);
    router.post('/lessons/:lessonId/complete', enrollmentController.completeLesson);
    router.get('/courses/:courseId/progress', enrollmentController.getProgress);
    return router;
};