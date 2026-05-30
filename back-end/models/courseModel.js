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

    async getCurriculum(courseId) {
        const query = `
            SELECT 
                m.id as module_id, 
                m.title as module_title, 
                m.order_index as module_order,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', l.id,
                            'title', l.title,
                            'content_type', l.content_type,
                            'order_index', l.order_index
                        ) ORDER BY l.order_index ASC
                    ) FILTER (WHERE l.id IS NOT NULL), '[]'
                ) as lessons
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id
            WHERE m.course_id = $1
            GROUP BY m.id
            ORDER BY m.order_index ASC;
        `;
        const result = await this.pool.query(query, [courseId]);
        return result.rows;
    }

    async delete(id) {
        await this.pool.query(`DELETE FROM courses WHERE id = $1`, [id]);
        return true;
    }
}