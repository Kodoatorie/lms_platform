// models/courseModel.js
export class CourseModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ title, description, teacherId }) {
        const result = await this.pool.query(
            `INSERT INTO courses (title, description, teacher_id) 
             VALUES ($1, $2, $3) RETURNING *`,
            [title, description, teacherId]
        );
        return result.rows[0];
    }

    async findAll(filters = {}) {
        let query = `SELECT * FROM courses`;
        const values = [];
        if (filters.teacherId) {
            query += ` WHERE teacher_id = $1`;
            values.push(filters.teacherId);
        }
        query += ` ORDER BY created_at DESC`;
        const result = await this.pool.query(query, values);
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT * FROM courses WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async update(id, { title, description }) {
        const result = await this.pool.query(
            `UPDATE courses SET title = COALESCE($1, title), description = COALESCE($2, description), updated_at = NOW()
             WHERE id = $3 RETURNING *`,
            [title, description, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
        return true;
    }
}