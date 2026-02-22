const pool = require('../config/database');

class Specialization {
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM specializations ORDER BY name'
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM specializations WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByName(name) {
    const result = await pool.query(
      'SELECT * FROM specializations WHERE name ILIKE $1',
      [`%${name}%`]
    );
    return result.rows;
  }
}

module.exports = Specialization;
