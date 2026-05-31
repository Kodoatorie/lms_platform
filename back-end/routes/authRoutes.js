import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import {
    validateRegister,
    validateLogin,
    validateRefresh,
} from '../middlewares/validationMiddleware.js';

export const createAuthRouter = (authController) => {
    const router = Router();

    router.post('/register', authLimiter, validateRegister, authController.register);
    router.post('/login',    authLimiter, validateLogin,    authController.login);
    router.post('/logout',   authController.logout);
    router.post('/refresh',  validateRefresh, authController.refresh);
    router.get('/me',        authMiddleware,  authController.me);

    return router;
};