import rateLimit from 'express-rate-limit';

// ── Global limiter (already applied in app.js) ────────────────────────────────
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
});

// ── Auth limiter: register / login / refresh / logout ─────────────────────────
// 10 attempts per 15 min per IP (raised from 5 — 5 was too strict for dev)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many auth attempts. Please wait 15 minutes.' },
    skipSuccessfulRequests: true, // only count failed attempts against the limit
});

// ── Heavy-operation limiter: certificate generation, ML endpoints ─────────────
export const heavyLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Rate limit exceeded for this operation.' },
});

// ── Submission limiter: prevent assignment spam ───────────────────────────────
export const submissionLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Submitting too fast. Please wait a moment.' },
});