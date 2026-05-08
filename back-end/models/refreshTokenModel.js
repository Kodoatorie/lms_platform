export class RefreshTokenModel {
    constructor(pool) {
        this.pool = pool;
    }
    async create(userId, tokenHash, expiresAt) {
        await this.pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
            [userId, tokenHash, expiresAt]
        );
    }
    async findByHash(tokenHash) {
        const res = await this.pool.query(`SELECT * FROM refresh_tokens WHERE token_hash = $1`, [tokenHash]);
        return res.rows[0];
    }
    async deleteByUserId(userId) {
        await this.pool.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
    }
}