export class ModuleModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ courseId, title, orderIndex }) {
        const result = await this.pool.query(
            `INSERT INTO modules (course_id, title, order_index)
             VALUES ($1, $2, $3) RETURNING *`,
            [courseId, title, orderIndex]
        );
        return result.rows[0];
    }

    async findByCourse(courseId) {
        const result = await this.pool.query(
            `SELECT * FROM modules WHERE course_id = $1 ORDER BY order_index ASC`,
            [courseId]
        );
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(`SELECT * FROM modules WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async update(id, { title, orderIndex }) {
        const result = await this.pool.query(
            `UPDATE modules SET title = COALESCE($1, title), order_index = COALESCE($2, order_index), updated_at = NOW()
             WHERE id = $3 RETURNING *`,
            [title, orderIndex, id]
        );
        return result.rows[0];
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM modules WHERE id = $1`, [id]);
        return true;
    }

    async getMaxOrderIndex(courseId) {
        const result = await this.pool.query(
            `SELECT COALESCE(MAX(order_index), 0) as max FROM modules WHERE course_id = $1`,
            [courseId]
        );
        return result.rows[0].max;
    }
}