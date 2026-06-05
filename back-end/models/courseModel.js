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

    async findAll({ teacherId, search } = {}) {
        const conditions = [];
        const values = [];
        let idx = 1;

        if (teacherId) {
            conditions.push(`c.teacher_id = $${idx++}`);
            values.push(teacherId);
        }
        if (search && search.trim()) {
            // Case-insensitive search on title and description
            conditions.push(`(c.title ILIKE $${idx} OR c.description ILIKE $${idx})`);
            values.push(`%${search.trim()}%`);
            idx++;
        }

        const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
            SELECT c.*, tp.full_name AS teacher_name
            FROM courses c
            LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
            ${where}
            ORDER BY c.created_at DESC
        `;
        const result = await this.pool.query(query, values);
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(
            `SELECT c.*, tp.full_name AS teacher_name
             FROM courses c
             LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
             WHERE c.id = $1`,
            [id]
        );
        return result.rows[0];
    }

    async update(id, { title, description, cover_url }) {
        const result = await this.pool.query(
            `UPDATE courses
             SET title       = COALESCE($1, title),
                 description = COALESCE($2, description),
                 cover_url   = COALESCE($3, cover_url),
                 updated_at  = NOW()
             WHERE id = $4 RETURNING *`,
            [title, description, cover_url || null, id]
        );
        return result.rows[0];
    }

    async getCurriculum(courseId) {
        const query = `
            SELECT
                m.id AS module_id,
                m.title AS module_title,
                m.order_index AS module_order,
                m.is_final,
                m.completion_message,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id',             l.id,
                            'title',          l.title,
                            'content_type',   l.content_type,
                            'content',        l.content,
                            'order_index',    l.order_index,
                            'available_from', l.available_from,
                            'deadline',       l.deadline,
                            'author_name',    tp.full_name
                        ) ORDER BY l.order_index ASC
                    ) FILTER (WHERE l.id IS NOT NULL), '[]'
                ) AS lessons
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id
            LEFT JOIN courses c ON m.course_id = c.id
            LEFT JOIN teacher_profiles tp ON tp.user_id = c.teacher_id
            WHERE m.course_id = $1
            GROUP BY m.id, m.title, m.order_index, m.is_final, m.completion_message
            ORDER BY m.order_index ASC
        `;
        const result = await this.pool.query(query, [courseId]);
        return result.rows;
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
        return true;
    }
}