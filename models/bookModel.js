const { DataTypes } = require('sequelize');
const db = require('../config/database');

// Mendefinisikan Struktur Tabel 'books'
const Book = db.define('books', {
    // ID otomatis dibuat oleh Sequelize jika tidak didefinisikan, 
    // tapi kita definisikan manual agar jelas
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING
    },
    publisher: {
        type: DataTypes.STRING
    },
    publish_year: {
        type: DataTypes.STRING(4)
    },
    isbn: {
        type: DataTypes.STRING(20)
    },
    call_number: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(50)
    },
    shelf_location: {
        type: DataTypes.STRING(20)
    }
}, {
    freezeTableName: true // Agar nama tabel tetap 'books', tidak diubah jadi 'books' (plural) otomatis
});

module.exports = Book;