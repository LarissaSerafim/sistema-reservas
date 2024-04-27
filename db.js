const { Pool } = require('pg');

const pool = new Pool({
host:"localhost",
    user: "larissa_serafim",
    port: 5432,
    password: "Lola.2016",
    database: "controle_reservas"

});

module.exports = pool;