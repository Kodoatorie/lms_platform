import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const createCertificateRouter = (certificateController) => {
    const router = Router();
    router.use(authMiddleware);
    router.post('/courses/:courseId/certificate', certificateController.generate);
    router.get('/me/certificates', certificateController.getMyCertificates);
    // Публичный маршрут для верификации (не требует аутентификации)
    router.get('/certificates/verify/:code', certificateController.verify);
    return router;
};