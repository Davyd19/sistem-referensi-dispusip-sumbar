const { Category, Book, Ruangan, Sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllCategories = async (req, res) => {
    try {
        const q = req.query.q || '';
        
        // 1. Dapatkan data ruangan berdasarkan admin yang login
        const adminId = req.user.id;
        const ruanganAdmin = await Ruangan.findOne({ 
            where: { id_admin_ruangan: adminId } 
        });

        const idRuangan = ruanganAdmin ? ruanganAdmin.id_ruangan : null;

        // 2. Ambil kategori dengan hitungan buku khusus di ruangan tersebut
        const categories = await Category.findAll({
            attributes: [
                'id', 'name', 'createdAt',
                [Sequelize.literal(`(
                    SELECT COUNT(*) FROM Books AS b 
                    WHERE b.category_id = Category.id 
                    ${idRuangan ? `AND b.id_ruangan = ${idRuangan}` : ''}
                )`), 'total_books']
            ],
            where: q ? { name: { [Op.like]: `%${q}%` } } : {},
            order: [['name', 'ASC']]
        });

        // 3. Render dengan menyertakan namaRuangan
        res.render('admin/category', {
            title: 'Daftar Kategori',
            namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : 'Semua Ruangan', // Muncul di header
            categories,
            q,
            active: 'categories'
        });

    } catch (error) {
        console.error("GET CATEGORIES ERROR:", error);
        res.status(500).send('Gagal mengambil data kategori');
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const adminId = req.user.id;

        // Ambil nama ruangan untuk header halaman edit
        const ruanganAdmin = await Ruangan.findOne({ where: { id_admin_ruangan: adminId } });
        const category = await Category.findByPk(id);

        if (!category) return res.status(404).send('Kategori tidak ditemukan');

        res.render('admin/categories/edit', {
            title: 'Edit Kategori',
            namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : null,
            category
        });
    } catch (error) {
        res.status(500).send('Gagal mengambil data kategori');
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') return res.status(400).send('Nama kategori wajib diisi');

        // findOrCreate agar tidak duplikat secara global
        await Category.findOrCreate({
            where: { 
                name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('name')), name.toLowerCase().trim()) 
            },
            defaults: { name: name.trim() }
        });

        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send('Gagal menambah kategori');
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const category = await Category.findByPk(id);
        
        if (category) {
            await category.update({ name: name.trim() });
        }
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send('Gagal memperbarui kategori');
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        // Cek dulu apakah kategori masih punya buku secara global
        const bookCount = await Book.count({ where: { category_id: id } });
        
        if (bookCount > 0) {
            return res.status(400).send('Gagal: Kategori masih digunakan oleh buku lain.');
        }

        await Category.destroy({ where: { id } });
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send('Gagal menghapus kategori');
    }
};