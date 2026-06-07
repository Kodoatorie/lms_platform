// routes/orderRoutes.js
import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';
import { orderLimiter } from '../middlewares/rateLimiter.js';

export const createOrderRouter = (orderController) => {
    const router = express.Router();

    // Webhook — no auth, called by payment provider
    router.post('/orders/webhook', orderController.webhook);

    // All other order routes require authentication
    router.use(authMiddleware);

    router.post('/orders',                           roleMiddleware(['student']), orderLimiter, orderController.createOrder);
    router.get('/orders/me',                         orderController.getMyOrders);
    router.patch('/orders/:orderId/attach-provider', roleMiddleware(['student']), orderController.attachProvider);
    router.patch('/orders/:orderId/refund',           roleMiddleware(['admin']),  orderController.refund);
    router.get('/courses/:courseId/orders',           roleMiddleware(['teacher', 'admin']), orderController.getCourseOrders);

    return router;
};
