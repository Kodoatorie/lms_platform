export class SubmissionModel {
    constructor(pool) {
        this.pool = pool;
    }

    async create({ assignmentId, userId, content }) {
        const result = await this.pool.query(
            `INSERT INTO submissions (assignment_id, user_id, content)
             VALUES ($1, $2, $3) RETURNING *`,
            [assignmentId, userId, content]
        );
        return result.rows[0];
    }

    async findByAssignmentAndUser(assignmentId, userId) {
        const result = await this.pool.query(
            `SELECT * FROM submissions WHERE assignment_id = $1 AND user_id = $2 ORDER BY submitted_at DESC LIMIT 1`,
            [assignmentId, userId]
        );
        return result.rows[0];
    }

    async findByAssignment(assignmentId) {
        const result = await this.pool.query(
            `SELECT s.*, u.email 
             FROM submissions s
             JOIN users u ON s.user_id = u.id
             WHERE s.assignment_id = $1
             ORDER BY s.submitted_at DESC`,
            [assignmentId]
        );
        return result.rows;
    }

    async findById(id) {
        const result = await this.pool.query(`SELECT * FROM submissions WHERE id = $1`, [id]);
        return result.rows[0];
    }
}