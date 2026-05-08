export class UserModel {
    constructor(pool) {
        this.pool = pool;
    }
    async findByEmail(email) {
        const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
    async findById(id) {
        const result = await this.pool.query('SELECT id, email, role, created_at, updated_at FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }
    async create(email, passwordHash, role) {
        const result = await this.pool.query(
            `INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role`,
            [email, passwordHash, role]
        );
        return result.rows[0];
    }
}