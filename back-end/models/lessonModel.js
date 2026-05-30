export class LessonModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ moduleId, title, contentType, content, orderIndex, availableFrom, deadline }) {
        const result = await this.pool.query(
            `INSERT INTO lessons (module_id, title, content_type, content, order_index, available_from, deadline)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [moduleId, title, contentType, content, orderIndex, availableFrom || null, deadline || null]
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

    // Returns lesson + teacher profile info
    async findByIdWithAuthor(id) {
        const result = await this.pool.query(
            `SELECT l.*, tp.full_name as author_name, tp.avatar_url as author_avatar
             FROM lessons l
             JOIN modules m ON l.module_id = m.id
             JOIN courses c ON m.course_id = c.id
             LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
             WHERE l.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async update(id, { title, content, orderIndex, contentType, availableFrom, deadline }) {
        const fields = [];
        const values = [];
        let idx = 1;
        if (title !== undefined)         { fields.push(`title = $${idx++}`);          values.push(title); }
        if (content !== undefined)       { fields.push(`content = $${idx++}`);        values.push(content); }
        if (orderIndex !== undefined)    { fields.push(`order_index = $${idx++}`);    values.push(orderIndex); }
        if (contentType !== undefined)   { fields.push(`content_type = $${idx++}`);   values.push(contentType); }
        if (availableFrom !== undefined) { fields.push(`available_from = $${idx++}`); values.push(availableFrom || null); }
        if (deadline !== undefined)      { fields.push(`deadline = $${idx++}`);       values.push(deadline || null); }
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