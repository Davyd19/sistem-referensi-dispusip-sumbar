const { Book, BookCopy, Institution, PuskelLoan, Author, Category, Publisher, Ruangan, Subject, BookAuthor, Sequelize } = require('../models');
const { Op } = Sequelize;
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// --- FUNGSI HELPER ---
const cleanupUnusedImage = async (imageFilename) => {
    try {
        if (!imageFilename) return;
        const booksUsingImage = await Book.count({ where: { image: imageFilename } });
        if (booksUsingImage === 0) {
            const filePath = path.join(__dirname, '../public/image/uploads', imageFilename);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
    } catch (error) { console.error("Error cleaning up image:", error); }
};

const toTitleCase = (str) => {
    if (!str) return "";
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Helper Format Tanggal Indonesia (DD/MM/YYYY)
const formatDateID = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

module.exports = {
    // ==========================================
    // 1. DASHBOARD LOGISTIK (Tabel Utama)
    // ==========================================
    index: async (req, res) => {
        try {
            // Cari ruangan yang SUDAH ADA sesuai seeder ('Ruangan Pustaka Keliling')
            let puskelRoom = await Ruangan.findOne({ 
                where: { nama_ruangan: { [Op.like]: '%Pustaka Keliling%' } } 
            });

            // Fallback: Jika tidak ketemu, baru buat
            if (!puskelRoom) {
                const adminId = req.session && req.session.user ? req.session.user.id : 1;
                puskelRoom = await Ruangan.create({ 
                    nama_ruangan: 'Ruangan Pustaka Keliling', 
                    description: 'Ruangan Mobil Keliling',
                    id_admin_ruangan: adminId
                });
            }
            
            const puskelRoomId = puskelRoom.id_ruangan;

            const { search, sort } = req.query;

            // Setup Sorting
            let orderQuery = [['updatedAt', 'DESC']]; 
            if (sort === 'title_asc') orderQuery = [[{ model: Book }, 'title', 'ASC']];
            if (sort === 'title_desc') orderQuery = [[{ model: Book }, 'title', 'DESC']];
            if (sort === 'oldest') orderQuery = [['updatedAt', 'ASC']];

            // Setup Filter
            let bookWhere = {};
            
            if (puskelRoomId) {
                bookWhere.id_ruangan = puskelRoomId;
            }

            if (search) {
                bookWhere = {
                    ...bookWhere,
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { isbn: { [Op.like]: `%${search}%` } }
                    ]
                };
            }

            const copies = await BookCopy.findAll({
                where: {
                    status: { [Op.or]: ['tersedia_puskel', 'dipinjam_puskel'] }
                },
                include: [
                    { 
                        model: Book,
                        where: bookWhere, 
                        attributes: ['title', 'isbn', 'publish_year', 'call_number'],
                        include: [
                            { model: Author, as: 'Authors' }, 
                            { model: Category }
                        ]
                    },
                    { 
                        model: PuskelLoan, 
                        as: 'puskelLoans', 
                        where: { status: 'active' }, 
                        required: false, 
                        include: ['institution'] 
                    }
                ],
                order: orderQuery 
            });

            res.render('admin/puskel/index', { 
                copies, 
                title: 'Logistik Pustaka Keliling',
                active: 'logistik',
                query: req.query,
                user: req.session.user,
                namaRuangan: req.session.user.nama_ruangan
            });
        } catch (error) {
            console.error("Error index puskel:", error);
            res.status(500).send("Terjadi kesalahan: " + error.message);
        }
    },

    // ==========================================
    // 2. DATA PEMINJAM (LEMBAGA)
    // ==========================================
    listBorrowers: async (req, res) => {
        try {
            const allInstitutions = await Institution.findAll({
                include: [{
                    model: PuskelLoan,
                    as: 'PuskelLoans',
                    required: false, 
                    include: [{
                        model: BookCopy, 
                        as: 'bookCopy',
                        include: [{ model: Book, attributes: ['title', 'isbn'] }]
                    }] 
                }],
                order: [['name', 'ASC']]
            });

            const activeData = allInstitutions.map(inst => {
                const loans = inst.PuskelLoans || [];
                const hasActive = loans.some(l => l.status === 'active');
                const isNew = loans.length === 0; 

                if (isNew || hasActive) {
                    const plainInst = inst.get({ plain: true });
                    plainInst.PuskelLoans = plainInst.PuskelLoans.filter(l => l.status === 'active');
                    return plainInst;
                }
                return null;
            }).filter(item => item !== null); 

            res.render('admin/puskel/borrowers', {
                institutions: activeData, 
                title: 'Data Lembaga Peminjam',
                active: 'borrowers',
                user: req.session.user,
                namaRuangan: req.session.user.nama_ruangan
            });
        } catch (error) {
            console.error("Error listBorrowers:", error); 
            res.status(500).send("Gagal memuat data peminjam: " + error.message);
        }
    },

    addInstitution: async (req, res) => {
        try {
            const { name, address, contact_person, phone } = req.body;
            if (!name || !address) {
                return res.send('<script>alert("Nama Lembaga dan Alamat wajib diisi!"); window.history.back();</script>');
            }
            await Institution.create({ 
                name: name.trim(), 
                address: address.trim(), 
                contact_person: contact_person || '-', 
                phone: phone || '-', 
                email: '-' 
            });
            res.redirect('/admin/puskel/borrowers');
        } catch (error) {
            res.status(500).send("Gagal tambah lembaga: " + error.message);
        }
    },

    detailInstitution: async (req, res) => {
        try {
            const { id } = req.params;
            const institution = await Institution.findByPk(id, {
                include: [{
                    model: PuskelLoan,
                    as: 'PuskelLoans',
                    where: { status: 'active' },
                    required: false,
                    include: [{
                        model: BookCopy,
                        as: 'bookCopy',
                        include: [{ model: Book, attributes: ['title', 'isbn'] }]
                    }]
                }]
            });

            if (!institution) return res.status(404).send("Lembaga tidak ditemukan");

            res.render('admin/puskel/detail_institution', {
                institution,
                title: 'Detail Peminjaman Lembaga',
                active: 'borrowers',
                user: req.session.user,
                namaRuangan: req.session.user.nama_ruangan
            });
        } catch (error) {
            console.error(error);
            res.status(500).send("Error detail: " + error.message);
        }
    },

    // ==========================================
    // 3. LOGISTIK & SIRKULASI
    // ==========================================
    
    showLoanSelection: async (req, res) => {
        try {
            const { institution_id } = req.params;
            const institution = await Institution.findByPk(institution_id);
            if (!institution) return res.status(404).send("Lembaga tidak ditemukan");

            const puskelRoom = await Ruangan.findOne({ 
                where: { nama_ruangan: { [Op.like]: '%Pustaka Keliling%' } } 
            });
            const puskelRoomId = puskelRoom ? puskelRoom.id_ruangan : 0;

            const availableBooks = await BookCopy.findAll({
                where: { status: 'tersedia_puskel' },
                include: [{ 
                    model: Book, 
                    where: { id_ruangan: puskelRoomId }, 
                    attributes: ['title', 'isbn', 'call_number', 'publish_year'],
                    include: [{ model: Author, as: 'Authors' }] 
                }],
                order: [[{ model: Book }, 'title', 'ASC']]
            });

            res.render('admin/puskel/loan_selection', {
                institution,
                availableBooks,
                title: 'Pilih Buku Pinjaman',
                active: 'borrowers',
                user: req.session.user,
                namaRuangan: req.session.user.nama_ruangan
            });
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    },

    loanBook: async (req, res) => {
        try {
            const { institution_id, book_copy_ids, due_date } = req.body;
            
            if (!book_copy_ids) {
                return res.send('<script>alert("Pilih minimal satu buku!"); window.history.back();</script>');
            }

            if (!due_date) {
                return res.send('<script>alert("Harap tentukan tanggal pengembalian!"); window.history.back();</script>');
            }

            const loanDate = new Date();
            const selectedDueDate = new Date(due_date);
            loanDate.setHours(0,0,0,0); 

            if (selectedDueDate < loanDate) {
                 return res.send('<script>alert("Tanggal kembali tidak boleh kurang dari hari ini!"); window.history.back();</script>');
            }

            const ids = Array.isArray(book_copy_ids) ? book_copy_ids : [book_copy_ids];

            for (const copyId of ids) {
                await PuskelLoan.create({
                    book_copy_id: copyId,
                    institution_id,
                    loan_date: new Date(), 
                    due_date: due_date,    
                    status: 'active'
                });

                await BookCopy.update({ status: 'dipinjam_puskel' }, { where: { id: copyId } });
            }

            res.redirect('/admin/puskel/institution/' + institution_id);
        } catch (error) {
            console.error(error);
            res.status(500).send(error.message);
        }
    },

    returnBook: async (req, res) => {
        try {
            const { loan_id } = req.body;
            const loan = await PuskelLoan.findByPk(loan_id);
            if (!loan) return res.status(404).send("Transaksi tidak ditemukan");
            
            loan.status = 'returned';
            loan.return_date = new Date();
            await loan.save();

            await BookCopy.update({ status: 'tersedia_puskel' }, { where: { id: loan.book_copy_id } });
            
            const referer = req.get('Referer');
            if (referer) { res.redirect(referer); } else { res.redirect('/admin/puskel/borrowers'); }
        } catch (error) { res.status(500).send(error.message); }
    },

    // ==========================================
    // INPUT BUKU MANUAL
    // ==========================================
    addStock: async (req, res) => {
        try {
            let { title, author, no_induk, call_number, quantity } = req.body;
            if (!title || !no_induk) return res.send('<script>alert("Judul & No Induk wajib!");history.back();</script>');

            let puskelRoom = await Ruangan.findOne({ 
                where: { nama_ruangan: { [Op.like]: '%Pustaka Keliling%' } } 
            });
            
            if (!puskelRoom) {
                const adminId = req.session && req.session.user ? req.session.user.id : 1;
                puskelRoom = await Ruangan.create({ 
                    nama_ruangan: 'Ruangan Pustaka Keliling',
                    description: 'Ruangan Mobil Keliling',
                    id_admin_ruangan: adminId 
                });
            }

            quantity = parseInt(quantity) || 1;
            let authorId = null;
            if (author) {
                const [auth] = await Author.findOrCreate({ where: { name: author.trim() } });
                authorId = auth.id;
            }

            const [book] = await Book.findOrCreate({
                where: { 
                    title: title.trim(),
                    id_ruangan: puskelRoom.id_ruangan
                },
                defaults: {
                    title: toTitleCase(title),
                    call_number: call_number || '-',
                    id_ruangan: puskelRoom.id_ruangan
                }
            });

            if (authorId) {
                const hasAuthor = await book.hasAuthor(authorId);
                if (!hasAuthor) await book.addAuthor(authorId, { through: { role: 'penulis' } });
            }

            if (call_number && (!book.call_number || book.call_number === '-')) {
                await book.update({ call_number: call_number });
            }

            let successCount = 0;
            for (let i = 0; i < quantity; i++) {
                let currentNoInduk = (quantity === 1) ? no_induk : (i === 0 ? no_induk : `${no_induk}-${i}`);
                const existingCopy = await BookCopy.findOne({ where: { no_induk: currentNoInduk } });

                if (existingCopy) {
                    existingCopy.status = 'tersedia_puskel';
                    await existingCopy.save();
                } else {
                    await BookCopy.create({
                        book_id: book.id,
                        no_induk: currentNoInduk,
                        status: 'tersedia_puskel',
                        condition: 'baik'
                    });
                }
                successCount++;
            }
            res.redirect('/admin/puskel?msg=success');
        } catch (error) {
            console.error("Error addStock:", error);
            res.status(500).send("Gagal memuat buku: " + error.message);
        }
    },

    // ==========================================
    // UPDATE STOK (EDIT DATA LENGKAP)
    // ==========================================
    updateStock: async (req, res) => {
        try {
            const { id } = req.params;
            const { no_induk, call_number, title, author } = req.body;

            // 1. Cari data copy berdasarkan ID
            const copy = await BookCopy.findByPk(id);
            if (!copy) return res.status(404).send("Data buku tidak ditemukan");

            // 2. Validasi & Update No. Induk (BookCopy)
            if (no_induk && no_induk !== copy.no_induk) {
                const existingCopy = await BookCopy.findOne({ where: { no_induk } });
                if (existingCopy) {
                    return res.send('<script>alert("Gagal: No. Induk sudah digunakan buku lain!");history.back();</script>');
                }
                copy.no_induk = no_induk;
                await copy.save();
            }

            // 3. Update Master Book (Judul & Call Number)
            const book = await Book.findByPk(copy.book_id);
            if (book) {
                // Update Judul & No Panggil
                if (title) book.title = toTitleCase(title);
                if (call_number) book.call_number = call_number;
                await book.save();

                // 4. Update Pengarang (Relasi Many-to-Many)
                if (author) {
                    // Cari atau buat author baru
                    const [authObj] = await Author.findOrCreate({ 
                        where: { name: author.trim() } 
                    });
                    
                    // Ganti relasi author buku ini dengan author yang baru/diedit
                    // setAuthors akan menghapus relasi lama dan memasang yang baru
                    await book.setAuthors([authObj]);
                }
            }

            res.redirect('/admin/puskel?msg=updated');

        } catch (error) {
            console.error("Error updateStock:", error);
            res.status(500).send("Gagal mengupdate data: " + error.message);
        }
    },

    // ==========================================
    // HAPUS STOK
    // ==========================================
    removeStock: async (req, res) => {
        try {
            const { id } = req.params;
            
            const copy = await BookCopy.findByPk(id);
            if (!copy) return res.status(404).send("Data tidak ditemukan");

            if (copy.status === 'dipinjam_puskel') {
                return res.send('<script>alert("Gagal: Buku sedang dipinjam oleh lembaga!");history.back();</script>');
            }
            
            const bookId = copy.book_id;

            await copy.destroy();

            const remainingCopies = await BookCopy.count({ 
                where: { book_id: bookId } 
            });

            if (remainingCopies === 0) {
                const book = await Book.findByPk(bookId);
                if (book) {
                    const imageFilename = book.image;
                    await book.destroy();
                    await cleanupUnusedImage(imageFilename);
                }
            }

            res.redirect('/admin/puskel');

        } catch (error) { 
            console.error("Error removeStock:", error);
            res.status(500).send("Gagal menghapus data: " + error.message); 
        }
    },

    // ==========================================
    // IMPORT EXCEL
    // ==========================================
    importExcel: async (req, res) => {
        try {
            if (!req.file) return res.status(400).send('File tidak ditemukan');
            
            // [PERBAIKAN] Cari 'Ruangan Pustaka Keliling'
            let puskelRoom = await Ruangan.findOne({ 
                where: { nama_ruangan: { [Op.like]: '%Pustaka Keliling%' } } 
            });
            if (!puskelRoom) {
                const adminId = req.session && req.session.user ? req.session.user.id : 1;
                puskelRoom = await Ruangan.create({ 
                    nama_ruangan: 'Ruangan Pustaka Keliling', 
                    description: 'Ruangan Mobil Keliling',
                    id_admin_ruangan: adminId 
                });
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(req.file.buffer);
            const worksheet = workbook.getWorksheet(1);
            let countSuccess = 0;
            
            for (let i = 2; i <= worksheet.rowCount; i++) {
                const row = worksheet.getRow(i);
                const title = row.getCell(2).text ? row.getCell(2).text.trim() : null;        
                const authorName = row.getCell(3).text ? row.getCell(3).text.trim() : null;   
                const noInduk = row.getCell(4).text ? row.getCell(4).text.trim() : null;      
                const callNumber = row.getCell(5).text ? row.getCell(5).text.trim() : null;   
                
                if (!noInduk || !title) continue; 
                
                const [book] = await Book.findOrCreate({
                    where: { 
                        title: title, 
                        id_ruangan: puskelRoom.id_ruangan 
                    }, 
                    defaults: { 
                        title: toTitleCase(title), 
                        call_number: callNumber, 
                        id_ruangan: puskelRoom.id_ruangan 
                    }
                });

                if (authorName) {
                    const [author] = await Author.findOrCreate({ where: { name: authorName } });
                    const hasAuthor = await book.hasAuthor(author);
                    if (!hasAuthor) await book.addAuthor(author, { through: { role: 'penulis' } });
                }

                const existingCopy = await BookCopy.findOne({ where: { no_induk: noInduk } });
                if (existingCopy) {
                    existingCopy.status = 'tersedia_puskel';
                    await existingCopy.save();
                } else {
                    await BookCopy.create({ book_id: book.id, no_induk: noInduk, status: 'tersedia_puskel', condition: 'baik' });
                }
                countSuccess++;
            }
            res.redirect('/admin/puskel?msg=success');
        } catch (error) { res.status(500).send('Gagal import: ' + error.message); }
    },

    // ==========================================
    // EXPORT
    // ==========================================
    downloadTemplate: async (req, res) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Format Import Puskel');
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Judul Buku', key: 'title', width: 30 },
                { header: 'Nama Pengarang', key: 'author', width: 25 },
                { header: 'No. Induk', key: 'no_induk', width: 20 },
                { header: 'No. Panggil', key: 'call_number', width: 20 },
                { header: 'EKS', key: 'qty', width: 10 }
            ];
            worksheet.addRow({ no: 1, title: 'Laskar Pelangi', author: 'Andrea Hirata', no_induk: 'PUS-001', call_number: '813 HIR l', qty: 1 });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Format_Import_Puskel.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send('Gagal download template'); }
    },

    exportExcel: async (req, res) => {
        try {
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Stok Puskel');
            worksheet.columns = [
                { header: 'No', key: 'no', width: 5 },
                { header: 'Judul Buku', key: 'title', width: 30 },
                { header: 'Nama Pengarang', key: 'author', width: 25 },
                { header: 'No. Induk', key: 'no_induk', width: 20 },
                { header: 'No. Panggil', key: 'call_number', width: 20 },
                { header: 'EKS', key: 'qty', width: 10 }
            ];
            const copies = await BookCopy.findAll({
                where: { status: { [Op.or]: ['tersedia_puskel', 'dipinjam_puskel'] } },
                include: [{ model: Book, include: [{model: Author, as: 'Authors'}] }]
            });
            copies.forEach((copy, index) => {
                const authorsName = (copy.Book && copy.Book.Authors && copy.Book.Authors.length > 0) 
                    ? copy.Book.Authors.map(a => a.name).join(', ') : '-';
                worksheet.addRow({
                    no: index + 1,
                    title: copy.Book ? copy.Book.title : '-',
                    author: authorsName,
                    no_induk: copy.no_induk,
                    call_number: copy.Book ? copy.Book.call_number : '-',
                    qty: 1
                });
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=Stok_Puskel.xlsx');
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) { res.status(500).send('Gagal export data'); }
    },

    exportLoanByInstitution: async (req, res) => {
        try {
            const { id } = req.params;
            const institution = await Institution.findByPk(id, {
                include: [{
                    model: PuskelLoan,
                    as: 'PuskelLoans',
                    where: { status: 'active' },
                    required: false, 
                    include: [{
                        model: BookCopy,
                        as: 'bookCopy',
                        include: [{ 
                            model: Book, 
                            include: [{ model: Author, as: 'Authors' }] 
                        }]
                    }]
                }]
            });

            if (!institution) return res.status(404).send("Lembaga tidak ditemukan");

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Daftar Koleksi');

            const currentYear = new Date().getFullYear();
            worksheet.mergeCells('A1:G1');
            const titleCell = worksheet.getCell('A1');
            titleCell.value = `DAFTAR KOLEKSI DIPINJAM DI POS-POS LAYANAN PUSKEL TAHUN ${currentYear}`;
            titleCell.font = { name: 'Arial', size: 12, bold: true };
            titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.mergeCells('A2:G2');
            const subTitleCell = worksheet.getCell('A2');
            subTitleCell.value = 'BIDANG LAYANAN PERPUSTAKAAN';
            subTitleCell.font = { name: 'Arial', size: 12, bold: true };
            subTitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

            worksheet.getCell('A4').value = 'Kabupaten/Kota';
            worksheet.getCell('C4').value = ': Padang'; 
            
            worksheet.getCell('A5').value = 'Pos Layanan';
            worksheet.getCell('C5').value = ': ' + institution.name;

            const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            worksheet.getCell('A6').value = 'Hari/Tanggal';
            worksheet.getCell('C6').value = ': ' + today;

            const headerRow = worksheet.getRow(8);
            headerRow.values = ['NO', 'JUDUL', 'PENGARANG', 'NO. INDUK', 'CALL NUMBER', 'EKS.', 'KET.*)'];
            
            headerRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

            let rowIndex = 9;
            if (institution.PuskelLoans && institution.PuskelLoans.length > 0) {
                institution.PuskelLoans.forEach((loan, index) => {
                    const book = loan.bookCopy && loan.bookCopy.Book ? loan.bookCopy.Book : null;
                    const authors = book && book.Authors ? book.Authors.map(a => a.name).join(', ') : '-';
                    
                    const row = worksheet.getRow(rowIndex);
                    row.values = [
                        index + 1,                                  
                        book ? book.title : 'Judul Error',          
                        authors,                                    
                        loan.bookCopy ? loan.bookCopy.no_induk : '-', 
                        book ? book.call_number : '-',              
                        1,                                          
                        ''                                          
                    ];

                    row.eachCell((cell, colNumber) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                        if (colNumber === 2 || colNumber === 3) {
                            cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
                        } else {
                            cell.alignment = { vertical: 'middle', horizontal: 'center' };
                        }
                    });

                    rowIndex++;
                });
            }

            worksheet.getColumn(1).width = 5;  
            worksheet.getColumn(2).width = 40; 
            worksheet.getColumn(3).width = 25; 
            worksheet.getColumn(4).width = 20; 
            worksheet.getColumn(5).width = 20; 
            worksheet.getColumn(6).width = 5;  
            worksheet.getColumn(7).width = 10; 

            const filename = `Peminjaman_${institution.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            await workbook.xlsx.write(res);
            res.end();

        } catch (error) {
            console.error("Error export detail:", error);
            res.status(500).send("Gagal export data: " + error.message);
        }
    },

    // ==========================================
    // 6. RIWAYAT PEMINJAMAN (HISTORY)
    // ==========================================
    historyBorrowers: async (req, res) => {
        try {
            const { search } = req.query;

            let institutionWhere = {};
            if (search) {
                institutionWhere = {
                    name: { [Op.like]: `%${search}%` } 
                };
            }

            const allInstitutions = await Institution.findAll({
                where: institutionWhere,
                include: [{
                    model: PuskelLoan,
                    as: 'PuskelLoans',
                    include: [{
                        model: BookCopy, 
                        as: 'bookCopy',
                        include: [{ model: Book, attributes: ['title'] }]
                    }] 
                }],
                order: [['updatedAt', 'DESC']]
            });

            const historyData = allInstitutions.map(inst => {
                const loans = inst.PuskelLoans || [];
                const activeLoans = loans.filter(l => l.status === 'active');
                const returnedLoans = loans.filter(l => l.status === 'returned');

                let shouldShow = false;

                if (search) {
                    shouldShow = returnedLoans.length > 0;
                } else {
                    shouldShow = (activeLoans.length === 0 && returnedLoans.length > 0);
                }

                if (shouldShow) {
                    returnedLoans.sort((a, b) => new Date(b.return_date) - new Date(a.return_date));
                    const lastTransaction = returnedLoans[0];
                    return {
                        name: inst.name,
                        address: inst.address,
                        contact: inst.contact_person,
                        phone: inst.phone,
                        total_books: returnedLoans.length, 
                        loan_date: lastTransaction ? formatDateID(lastTransaction.loan_date) : null,
                        return_date: lastTransaction ? formatDateID(lastTransaction.return_date) : null
                    };
                }
                return null;
            }).filter(item => item !== null); 

            res.render('admin/puskel/history', {
                historyData,
                title: 'Riwayat Peminjaman',
                active: 'puskel_history',
                query: req.query,
                user: req.session.user,
                namaRuangan: req.session.user.nama_ruangan
            });
        } catch (error) {
            console.error("Error history:", error); 
            res.status(500).send("Gagal memuat riwayat: " + error.message);
        }
    },

    // Placeholder untuk CRUD buku standar agar tidak error jika dipanggil
    showAddPage: async (req, res) => { res.send("Fitur Add Manual"); },
    addBook: async (req, res) => { res.send("Fitur Add Book"); },
    showEditPage: async (req, res) => { res.send("Fitur Edit Page"); },
    updateBook: async (req, res) => { res.send("Fitur Update Book"); },
    deleteMultiple: async (req, res) => { res.send("Fitur Delete"); },
};