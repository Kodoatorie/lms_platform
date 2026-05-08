import { hashPassword, comparePassword } from '../utils/hash.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { generateVerificationCode } from '../utils/generateCode.js';
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
        return { user, accessToken, refreshToken };
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
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const tokenRecord = await this.refreshTokenModel.findByHash(hash);
        if (tokenRecord) {
            await this.refreshTokenModel.deleteByUserId(tokenRecord.user_id);
        }
        if (this.redis && accessToken) {
            const decoded = require('../utils/jwt.js').verifyAccessToken(accessToken);
            const ttl = Math.floor(decoded.exp - Date.now() / 1000);
            if (ttl > 0) await this.redis.setEx(`blacklist:${accessToken}`, ttl, 'true');
        }
    }
    async refresh(oldRefreshToken) {
        try {
            const payload = require('../utils/jwt.js').verifyRefreshToken(oldRefreshToken);
            const hash = crypto.createHash('sha256').update(oldRefreshToken).digest('hex');
            const stored = await this.refreshTokenModel.findByHash(hash);
            if (!stored) throw new Error('Invalid refresh token');
            const user = await this.userModel.findById(payload.id);
            if (!user) throw new Error('User not found');
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            await this.refreshTokenModel.create(user.id, newHash, expiresAt);
            await this.refreshTokenModel.deleteByUserId(user.id); // удалить старый? Лучше удалить конкретный старый
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (err) {
            throw new Error('Invalid refresh token');
        }
    }
}