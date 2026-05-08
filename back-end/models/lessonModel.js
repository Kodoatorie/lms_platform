export class LessonModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ moduleId, title, contentType, content, orderIndex }) {
        const result = await this.pool.query(
            `INSERT INTO lessons (module_id, title, content_type, content, order_index)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [moduleId, title, contentType, content, orderIndex]
        );
        return result.rows[0];
    }

    async findByModule(moduleId) {
        const result = await this.pool.query(
            `SELECT * FROM lessons WHERE module_id = $1 ORDER BY order_index ASC`,
            [moduleId]
        );
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(`SELECT * FROM lessons WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async update(id, { title, content, orderIndex, contentType }) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
        if (content !== undefined) { fields.push(`content = $${idx++}`); values.push(content); }
        if (orderIndex !== undefined) { fields.push(`order_index = $${idx++}`); values.push(orderIndex); }
        if (contentType !== undefined) { fields.push(`content_type = $${idx++}`); values.push(contentType); }
        if (fields.length === 0) return null;
        fields.push(`updated_at = NOW()`);
        values.push(id);
        const query = `UPDATE lessons SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM lessons WHERE id = $1`, [id]);
        return true;
    }

    async getMaxOrderIndex(moduleId) {
        const result = await this.pool.query(
            `SELECT COALESCE(MAX(order_index), 0) as max FROM lessons WHERE module_id = $1`,
            [moduleId]
        );
        return result.rows[0].max;
    }
}