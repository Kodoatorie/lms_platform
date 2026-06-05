// controllers/orderController.js
import { logger } from '../utils/logger.js';

export class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }

    // POST /orders  { courseId, paymentProvider? }
    createOrder = async (req, res, next) => {
        try {
            const { courseId, paymentProvider } = req.body;
            if (!courseId) return res.status(400).json({ error: 'courseId is required' });
            const result = await this.orderService.createOrder(
                req.user.id, courseId, paymentProvider
            );
            res.status(201).json(result);
        } catch (err) {
            next(err);
        }
    };

    // GET /orders/me
    getMyOrders = async (req, res, next) => {
        try {
            const orders = await this.orderService.getMyOrders(req.user.id);
            res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    // GET /courses/:courseId/orders  (teacher/admin)
    getCourseOrders = async (req, res, next) => {
        try {
            const orders = await this.orderService.getCourseOrders(
                req.params.courseId, req.user.id, req.user.role
            );
            res.json(orders);
        } catch (err) {
            next(err);
        }
    };

    // POST /orders/webhook  — called by payment provider (no auth)
    webhook = async (req, res, next) => {
        try {
            const { event, provider_order_id, provider_data } = req.body;
            logger.info('[Webhook] Received', { event, provider_order_id });

            if (event === 'payment.success') {
                await this.orderService.handlePaymentSuccess(provider_order_id, provider_data);
            } else if (event === 'payment.failed') {
                await this.orderService.handlePaymentFailure(provider_order_id, provider_data);
            } else {
                logger.warn('[Webhook] Unknown event', { event });
            }

            // Always respond 200 to prevent provider retry storms
            res.status(200).json({ received: true });
        } catch (err) {
            logger.error('[Webhook] Error', { message: err.message });
            // Still 200 — log the error but don't cause retries for internal issues
            res.status(200).json({ received: true, warning: err.message });
        }
    };

    // PATCH /orders/:orderId/attach-provider  { providerOrderId }
    attachProvider = async (req, res, next) => {
        try {
            const { providerOrderId } = req.body;
            const order = await this.orderService.attachProviderOrderId(
                req.params.orderId, providerOrderId
            );
            res.json(order);
        } catch (err) {
            next(err);
        }
    };

    // PATCH /orders/:orderId/refund  (admin only)
    refund = async (req, res, next) => {
        try {
            const order = await this.orderService.refundOrder(
                req.params.orderId, req.user.id, req.user.role
            );
            res.json(order);
        } catch (err) {
            next(err);
        }
    };
}
