const Sequelize = require('sequelize');

// Konfigurasi koneksi Sequelize
const db = new Sequelize('db_referensi', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Set true jika ingin melihat log SQL di terminal
    define: {
        timestamps: false // Matikan created_at/updated_at otomatis jika tidak butuh
    }
});

module.exports = db;