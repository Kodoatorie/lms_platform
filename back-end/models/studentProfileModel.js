// models/studentProfileModel.js
export class StudentProfileModel {
    constructor(pool) {
        this.pool = pool;
    }
    async create(userId, fullName, avatarUrl = null, metadata = {}) {
        const result = await this.pool.query(
            `INSERT INTO student_profiles (user_id, full_name, avatar_url, metadata)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [userId, fullName, avatarUrl, metadata]
        );
        return result.rows[0];
    }
    async findByUserId(userId) {
        const result = await this.pool.query(
            `SELECT * FROM student_profiles WHERE user_id = $1`,
            [userId]
        );
        return result.rows[0];
    }
    async update(userId, { fullName, avatarUrl, metadata }) {
        const result = await this.pool.query(
            `UPDATE student_profiles 
             SET full_name = COALESCE($1, full_name),
                 avatar_url = COALESCE($2, avatar_url),
                 metadata = COALESCE($3, metadata),
                 updated_at = NOW()
             WHERE user_id = $4 RETURNING *`,
            [fullName, avatarUrl, metadata, userId]
        );
        return result.rows[0];
    }
}