const { Subject, Ruangan, Book, Sequelize } = require('../models');
const { Op } = require('sequelize');

exports.getAllSubjects = async (req, res) => {
    try {
        const q = req.query.q || '';
        const adminId = req.user.id;

        // 1. Ambil data ruangan berdasarkan admin yang login
        const ruanganAdmin = await Ruangan.findOne({ 
            where: { id_admin_ruangan: adminId } 
        });

        const idRuangan = ruanganAdmin ? ruanganAdmin.id_ruangan : null;

        // 2. Ambil semua subjek global dengan hitungan buku di ruangan tersebut
        const subjects = await Subject.findAll({
            attributes: [
                'id', 
                'name', 
                'createdAt',
                [Sequelize.literal(`(
                    SELECT COUNT(*) FROM BookSubjects AS bs
                    JOIN Books AS b ON bs.book_id = b.id
                    WHERE bs.subject_id = Subject.id
                    ${idRuangan ? `AND b.id_ruangan = ${idRuangan}` : ''}
                )`), 'total_books']
            ],
            where: q ? { name: { [Op.like]: `%${q}%` } } : {},
            order: [['name', 'ASC']]
        });

        res.render('admin/subject', {
            title: 'Daftar Subjek',
            // Mengirimkan namaRuangan agar muncul di header
            namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : 'Semua Ruangan',
            subjects,
            q,
            active: 'subject'
        });
    } catch (err) {
        console.error("GET SUBJECTS ERROR:", err);
        res.status(500).send('Gagal mengambil data subjek');
    }
};

exports.addSubject = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') return res.redirect('/admin/subjects');

        // findOrCreate agar tidak duplikat secara global
        await Subject.findOrCreate({
            where: Sequelize.where(
                Sequelize.fn('LOWER', Sequelize.col('name')), 
                name.toLowerCase().trim()
            ),
            defaults: { name: name.trim() }
        });

        res.redirect('/admin/subjects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal menambah subjek');
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const subject = await Subject.findByPk(id);
        if (!subject) return res.status(404).send('Subjek tidak ditemukan');

        await subject.update({ name: name.trim() });
        res.redirect('/admin/subjects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal memperbarui subjek');
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { BookSubject } = require('../models');

        // Proteksi: Cek apakah subjek masih digunakan oleh buku manapun
        const count = await BookSubject.count({ where: { subject_id: id } });
        if (count > 0) {
            return res.status(400).send('Gagal: Subjek masih digunakan oleh beberapa buku.');
        }

        const subject = await Subject.findByPk(id);
        if (!subject) return res.status(404).send('Subjek tidak ditemukan');

        await subject.destroy();
        res.redirect('/admin/subjects');
    } catch (err) {
        console.error(err);
        res.status(500).send('Gagal menghapus subjek');
    }
};