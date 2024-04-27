const express = require('express');
const router = express.Router();
const pool = require('./db');
const verificarDataExistente = require('./controllers');


// busca todas as reservas
router.get('/reservas', async (req, res) => {
    try {
        const todasReservas = await pool.query('SELECT * FROM reservas');
        res.json(todasReservas.rows);
    } catch (err) {
        console.error('Erro ao obter reservas:', err.message);
        res.status(500).send('Erro interno do servidor');
    }
});

// busca apenas uma reserva específica
router.get('/reservas/:id', async (req, res) => {
    try {
        const reserva = await pool.query('SELECT * FROM reservas WHERE id = $1', [req.params.id]);
        res.json(reserva.rows);
    } catch (err) {
        console.error('Erro ao obter reservas:', err.message);
        res.status(500).send('Erro interno do servidor');
    }
});


// verifica apenas uma reserva específica
router.post('/verificar/disponibilidade', async (req, res) => {
    try {
        const { data } = req.body;
        const dataExiste = await verificarDataExistente(data);

        if (dataExiste) {
            return res.status(400).json({ error: 'Esta data já está reservada' });
        } else {
            return res.status(200).json({ message: 'Data disponível para reserva' });
        }
    } catch (err) {
        console.error('Erro ao verificar reservas:', err.message);
        return res.status(500).send('Erro interno do servidor');
    }
});

//adiciona reserva
router.post('/reservar', async (req, res) => {
    try {
        const { data, espaco, cliente, qtd_pessoas } = req.body;

        if (!data || !espaco || !cliente || !qtd_pessoas) {
            return res.status(400).send('Por favor, preencha todos os campos');
        }

        const lastIdQuery = 'SELECT id FROM reservas ORDER BY id DESC LIMIT 1';
        const lastIdResult = await pool.query(lastIdQuery);
        const lastId = lastIdResult.rows.length > 0 ? lastIdResult.rows[0].id : 0;
                
        const newId = lastId + 1;
    
        const query = 'INSERT INTO reservas (id, data, espaco, cliente, status, qtd_pessoas) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [newId, data, espaco, cliente, 'ativo', qtd_pessoas];

        await pool.query(query, values);

        res.status(201).send('Reserva criada com sucesso');
    } catch (err) {
        console.error('Erro ao criar reserva:', err.message);
        res.status(500).send('Erro ao criar reserva, verifique os dados fornecidos');
    }
});


router.put('/cancelar/:id', async (req, res) => {
    try {
        const reservaId = parseInt(req.params.id);

        if (isNaN(reservaId)) {
            return res.status(400).send('ID de reserva inválido');
        }

        const checkReservaQuery = 'SELECT * FROM reservas WHERE id = $1';
        const checkReservaResult = await pool.query(checkReservaQuery, [reservaId]);

        if (checkReservaResult.rows.length === 0) {
            return res.status(404).send('Reserva não encontrada');
        }

        const updateQuery = 'UPDATE reservas SET status = $1 WHERE id = $2';
        const values = ['cancelado', reservaId];

        await pool.query(updateQuery, values);

        res.status(200).send('Reserva cancelada com sucesso');
    } catch (err) {
        console.error('Erro ao cancelar reserva:', err.message);
        res.status(500).send('Erro ao cancelar reserva, verifique os dados fornecidos');
    }
});


module.exports = router;
