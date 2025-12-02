const Book = require('../models/bookModel');
const QRCode = require('qrcode'); // Import Library QR

// ... (Kode handleSearch, index, search biarkan tetap sama) ...
// ... salin fungsi index dan search dari kode sebelumnya ...

async function handleSearch(req, res, titlePage) {
    // ... (Isi fungsi ini TETAP SAMA seperti sebelumnya) ...
    // Saya persingkat disini agar fokus ke perubahan detail
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const params = {
            keyword: req.query.q,
            searchBy: req.query.searchBy || 'title',
            matchType: req.query.matchType || 'contains',
            category: req.query.category,
            year: req.query.year,
            page: page,
            limit: limit
        };

        const result = await Book.searchAdvanced(params);
        const categories = await Book.getCategories();
        const years = await Book.getYears();
        const totalPages = Math.ceil(result.count / limit);

        res.render('index', { 
            title: titlePage,
            books: result.rows,
            totalItems: result.count,
            currentPage: page,
            totalPages: totalPages,
            query: req.query,
            sidebarData: { categories, years }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Database Error");
    }
}

exports.index = async (req, res) => { await handleSearch(req, res, 'Katalog Perpustakaan'); };
exports.search = async (req, res) => { await handleSearch(req, res, 'Hasil Pencarian'); };

// --- PERUBAHAN UTAMA DI SINI (Fungsi Detail) ---
exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const book = await Book.findByPk(id);
        
        if (book) {
            const relatedBooks = await Book.getRelated(id, 5);

            // 1. GENERATE QR CODE
            // Isi teks yang akan disimpan di HP Pengunjung
            const qrData = `Judul: ${book.title}\nNo Panggil: ${book.call_number}\nLokasi: Rak ${book.shelf_location}`;
            
            // Buat gambar dalam format Data URL (base64)
            const qrImage = await QRCode.toDataURL(qrData);

            res.render('detail', { 
                title: book.title, 
                book: book,
                relatedBooks: relatedBooks,
                qrImage: qrImage // Kirim gambar QR ke View
            });
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.redirect('/');
    }
};