const { DataTypes, Op } = require('sequelize'); 
const db = require('../config/database');

const Book = db.define('books', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // --- Data Utama ---
    title: { type: DataTypes.STRING, allowNull: false }, // Judul Utama
    original_title: { type: DataTypes.STRING }, // Judul Asli
    author: { type: DataTypes.STRING }, // Pengarang Utama
    additional_author: { type: DataTypes.STRING }, // Pengarang Tambahan/Editor
    statement_of_responsibility: { type: DataTypes.STRING }, // Pernyataan Tanggung Jawab (Full String)
    
    // --- Data Seri & Edisi ---
    series_title: { type: DataTypes.STRING }, // Judul Seri
    edition: { type: DataTypes.STRING }, // Edisi
    
    // --- Data Penerbitan ---
    publisher: { type: DataTypes.STRING },
    publish_year: { type: DataTypes.STRING(4) },
    publish_place: { type: DataTypes.STRING }, 
    
    // --- Deskripsi Fisik & RDA ---
    physical_description: { type: DataTypes.STRING }, // 99 hal : ilus ; 25 cm
    content_type: { type: DataTypes.STRING, defaultValue: 'teks' }, // Jenis Isi
    media_type: { type: DataTypes.STRING, defaultValue: 'tanpa perantara' }, // Jenis Media
    carrier_type: { type: DataTypes.STRING, defaultValue: 'volume' }, // Jenis Wadah
    
    // --- Identitas & Klasifikasi ---
    isbn: { type: DataTypes.STRING(20) },
    call_number: { type: DataTypes.STRING(50), allowNull: false },
    subject: { type: DataTypes.STRING }, // Subjek
    category: { type: DataTypes.STRING(50), defaultValue: 'Monograf' }, // Jenis Bahan
    
    // --- Lainnya ---
    abstract: { type: DataTypes.TEXT }, 
    notes: { type: DataTypes.TEXT }, 
    language: { type: DataTypes.STRING(20), defaultValue: 'Indonesia' },
    work_type: { type: DataTypes.STRING, defaultValue: 'Bukan fiksi' }, // Bentuk Karya
    target_audience: { type: DataTypes.STRING, defaultValue: 'Umum' },
    
    // --- Lokasi ---
    shelf_location: { type: DataTypes.STRING(20) },
    stock_total: { type: DataTypes.INTEGER, defaultValue: 1 },
    stock_available: { type: DataTypes.INTEGER, defaultValue: 1 }

}, {
    freezeTableName: true
});

// --- LOGIKA PENCARIAN KOMPLEKS (INLIS STYLE) ---
Book.searchAdvanced = async (params) => {
    const { 
        keyword, 
        searchBy = 'title', // Judul, Pengarang, ISBN
        matchType = 'contains', // contains (default), startsWith, endsWith, exact
        category, 
        year, 
        page = 1, 
        limit = 10 
    } = params;

    const offset = (page - 1) * limit;
    let whereCondition = {};

    // Logika Pencocokan String (Match Type)
    let searchOperator;
    let searchValue;

    if (keyword) {
        switch (matchType) {
            case 'startsWith': // Dimulai Dengan
                searchOperator = Op.like;
                searchValue = `${keyword}%`;
                break;
            case 'endsWith': // Diakhiri Dengan
                searchOperator = Op.like;
                searchValue = `%${keyword}`;
                break;
            case 'exact': // Tepat
                searchOperator = Op.eq;
                searchValue = keyword;
                break;
            default: // Default / Salah Satu Isi (Contains)
                searchOperator = Op.like;
                searchValue = `%${keyword}%`;
        }

        // Terapkan ke Kolom yang Dipilih
        if (searchBy === 'all') {
            whereCondition[Op.or] = [
                { title: { [searchOperator]: searchValue } },
                { author: { [searchOperator]: searchValue } },
                { isbn: { [searchOperator]: searchValue } }
            ];
        } else {
            // Pastikan kolom ada di DB, jika tidak default ke title
            const column = ['title', 'author', 'isbn', 'call_number', 'publisher', 'subject'].includes(searchBy) ? searchBy : 'title';
            whereCondition[column] = { [searchOperator]: searchValue };
        }
    }

    // Filter Tambahan (Sidebar)
    if (category) whereCondition.category = category;
    if (year) whereCondition.publish_year = year;

    return await Book.findAndCountAll({
        where: whereCondition,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['title', 'ASC']]
    });
};

// Helper methods
Book.getYears = async () => {
    return await Book.findAll({
        attributes: [[db.fn('DISTINCT', db.col('publish_year')), 'year']],
        order: [['publish_year', 'DESC']]
    });
};

Book.getCategories = async () => {
    return await Book.findAll({
        attributes: [[db.fn('DISTINCT', db.col('category')), 'category']],
        order: [['category', 'ASC']]
    });
};

Book.getRelated = async (excludeId, limit = 4) => {
    return await Book.findAll({
        where: { id: { [Op.ne]: excludeId } },
        limit: limit,
        order: db.random()
    });
}

module.exports = Book;