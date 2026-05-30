import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../utils/jwt.js';
import crypto from 'crypto';

export class AuthService {
    constructor(userModel, refreshTokenModel, studentProfileModel, teacherProfileModel, redisClient) {
        this.userModel = userModel;
        this.refreshTokenModel = refreshTokenModel;
        this.studentProfileModel = studentProfileModel;
        this.teacherProfileModel = teacherProfileModel;
        this.redis = redisClient;
    }

    async register(email, password, role, fullName) {
        const existing = await this.userModel.findByEmail(email);
        if (existing) throw new Error('User already exists');
        const hashed = await hashPassword(password);
        const user = await this.userModel.create(email, hashed, role);
        if (role === 'student') {
            await this.studentProfileModel.create(user.id, fullName);
        } else if (role === 'teacher') {
            await this.teacherProfileModel.create(user.id, fullName);
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenModel.create(user.id, refreshHash, expiresAt);
        return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
    }

    async login(email, password) {
        const user = await this.userModel.findByEmail(email);
        if (!user) throw new Error('Invalid credentials');
        const valid = await comparePassword(password, user.password_hash);
        if (!valid) throw new Error('Invalid credentials');
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenModel.create(user.id, refreshHash, expiresAt);
        return { user: { id: user.id, email: user.email, role: user.role }, accessToken, refreshToken };
    }

    async logout(refreshToken, accessToken) {
        // FIX: was using require() in ESM module — replaced with named import
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const tokenRecord = await this.refreshTokenModel.findByHash(hash);
        if (tokenRecord) {
            await this.refreshTokenModel.deleteByHash(hash);
        }
        if (this.redis && accessToken) {
            try {
                const decoded = verifyAccessToken(accessToken);
                const ttl = Math.floor(decoded.exp - Date.now() / 1000);
                if (ttl > 0) await this.redis.setEx(`blacklist:${accessToken}`, ttl, 'true');
            } catch {
                // token already expired — no need to blacklist
            }
        }
    }

    async refresh(oldRefreshToken) {
        try {
            // FIX: was using require() in ESM module — replaced with named import
            const payload = verifyRefreshToken(oldRefreshToken);
            const hash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
            const stored = await this.refreshTokenModel.findByHash(hash);
            if (!stored) throw new Error('Invalid refresh token');
            const user = await this.userModel.findById(payload.id);
            if (!user) throw new Error('User not found');

            // FIX: delete the OLD token BEFORE creating the new one
            // Previously deleteByUserId ran after create, wiping the new token too
            await this.refreshTokenModel.deleteByHash(hash);

            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await this.refreshTokenModel.create(user.id, newHash, expiresAt);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new Error('Invalid refresh token');
        }
    }
}