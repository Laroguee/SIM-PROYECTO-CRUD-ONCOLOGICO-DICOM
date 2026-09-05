const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ehr_oncologico',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión a la base de datos
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado a la base de datos MySQL (XAMPP)');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a la base de datos MySQL. Asegúrate de que XAMPP esté encendido y la base de datos exista.', err.message);
    });

module.exports = pool;
