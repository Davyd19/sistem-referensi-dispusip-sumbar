const Book = require('../models/bookModel');
const { Op } = require('sequelize'); // Operator untuk query (LIKE, OR, AND)

exports.index = async (req, res) => {
    try {
        // Tampilkan halaman awal kosong
        res.render('index', { 
            title: 'Beranda', 
            books: [], 
            searched: false,
            keyword: '',
            category: ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Terjadi kesalahan server");
    }
};

exports.search = async (req, res) => {
    const keyword = req.query.q || '';
    const category = req.query.category || '';

    try {
        // Membangun kondisi pencarian (Query Construction)
        let whereCondition = {
            [Op.or]: [
                { title: { [Op.like]: `%${keyword}%` } },
                { author: { [Op.like]: `%${keyword}%` } },
                { call_number: { [Op.like]: `%${keyword}%` } }
            ]
        };

        // Jika ada filter kategori, tambahkan kondisi AND
        if (category && category !== '') {
            whereCondition = {
                [Op.and]: [
                    whereCondition, // Kondisi pencarian keyword di atas
                    { category: category }
                ]
            };
        }

        // Eksekusi Query dengan Sequelize
        const books = await Book.findAll({
            where: whereCondition
        });

        // Render view
        res.render('index', { 
            title: 'Hasil Pencarian', 
            books: books, // Sequelize mengembalikan array object langsung
            searched: true,
            keyword: keyword,
            category: category
        });

    } catch (error) {
        console.error("Error saat mencari:", error);
        res.status(500).send("Database Error: " + error.message);
    }
};

exports.detail = async (req, res) => {
    const id = req.params.id;

    try {
        const book = await Book.findOne({
            where: { id: id }
        });

        if (book) {
            res.render('detail', { 
                title: book.title, 
                book: book 
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error("Error detail:", error);
        res.redirect('/');
    }
};