import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

export const createReviewRouter = (reviewController) => {
    const router = Router();
    router.use(authMiddleware);
    // Student: leave a review for a course
    router.post('/courses/:courseId/reviews', roleMiddleware(['student']), reviewController.create);
    // Anyone: read reviews
    router.get('/courses/:courseId/reviews', reviewController.getByCourse);
    router.get('/teachers/:teacherId/reviews', reviewController.getByTeacher);
    // Student: delete own review
    router.delete('/reviews/:reviewId', roleMiddleware(['student']), reviewController.delete);
    return router;
};