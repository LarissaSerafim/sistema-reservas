const pool = require('./db');


async function verificarDataExistente(data) {
    try {
    const result = await pool.query('SELECT COUNT(*) AS count FROM reservas WHERE data = $1', [data]);
    if (result.rows[0].count > 0) {
        return true; // Data já existe
    }
      return false; // Data não existe
    } catch (error) {
    console.error('Erro ao verificar reserva:', error);
    throw new Error('Erro interno do servidor');
    }
}

module.exports = verificarDataExistente;
