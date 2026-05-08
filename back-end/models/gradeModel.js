export class GradeModel {
    constructor(pool) {
        this.pool = pool;
    }

    async createOrUpdate({ submissionId, score, feedback, gradedById }) {
        const existing = await this.pool.query(
            `SELECT * FROM grades WHERE submission_id = $1`,
            [submissionId]
        );
        if (existing.rows[0]) {
            const result = await this.pool.query(
                `UPDATE grades 
                 SET score = $1, feedback = $2, graded_by = $3, graded_at = NOW(), updated_at = NOW()
                 WHERE submission_id = $4 RETURNING *`,
                [score, feedback, gradedById, submissionId]
            );
            return result.rows[0];
        } else {
            const result = await this.pool.query(
                `INSERT INTO grades (submission_id, score, feedback, graded_by)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [submissionId, score, feedback, gradedById]
            );
            return result.rows[0];
        }
    }

    async findBySubmission(submissionId) {
        const result = await this.pool.query(`SELECT * FROM grades WHERE submission_id = $1`, [submissionId]);
        return result.rows[0];
    }
}