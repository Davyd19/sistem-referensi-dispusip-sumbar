const { Publisher, Ruangan, Book, Sequelize } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // Menampilkan halaman list penerbit
  index: async (req, res) => {
    try {
      // 1. Ambil query 'q' dari URL untuk fitur search
      const q = req.query.q || '';
      const adminId = req.user.id;
      
      // 2. Ambil data ruangan berdasarkan admin yang login
      const ruanganAdmin = await Ruangan.findOne({ 
        where: { id_admin_ruangan: adminId } 
      });

      const idRuangan = ruanganAdmin ? ruanganAdmin.id_ruangan : null;

      // 3. Ambil semua penerbit dengan filter pencarian dan hitungan buku
      const publishers = await Publisher.findAll({
        attributes: [
          'id', 
          'name', 
          'createdAt',
          [Sequelize.literal(`(
            SELECT COUNT(*) FROM BookPublishers AS bp
            JOIN Books AS b ON bp.book_id = b.id
            WHERE bp.publisher_id = Publisher.id
            ${idRuangan ? `AND b.id_ruangan = ${idRuangan}` : ''}
          )`), 'total_books']
        ],
        // 🔑 Tambahkan kondisi WHERE agar fitur search berfungsi
        where: q ? {
          name: { [Op.like]: `%${q}%` }
        } : {},
        order: [['name', 'ASC']]
      });

      res.render('admin/publisher', {
        title: 'Kelola Penerbit',
        namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : 'Semua Ruangan',
        publishers,
        q, // 🔑 Kirim q ke view agar input text search tidak hilang setelah reload
        user: req.user,
        active: 'publishers'
      });
    } catch (error) {
      console.error("PUBLISHER INDEX ERROR:", error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Menambah penerbit baru (Global)
  store: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || name.trim() === '') return res.status(400).send('Nama penerbit wajib diisi');

      // findOrCreate agar tidak duplikat secara global (case-insensitive)
      await Publisher.findOrCreate({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')), 
          name.toLowerCase().trim()
        ),
        defaults: { name: name.trim() }
      });

      res.redirect('/admin/publishers');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal menambahkan penerbit');
    }
  },

  // Mengupdate data penerbit (Global)
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Publisher.update({ name: name.trim() }, { where: { id } });
      res.redirect('/admin/publishers');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal mengupdate penerbit');
    }
  },

  // Menghapus penerbit (Global protection)
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      
      /**
       * Hapus pengecekan count.
       * Karena di migrasi BookPublishers sudah diset onDelete: 'CASCADE' 
       * pada publisher_id, maka menghapus Publisher akan otomatis 
       * menghapus baris terkait di tabel BookPublishers tanpa menghapus bukunya.
       */
      const result = await Publisher.destroy({ where: { id } });

      if (result === 0) {
        return res.status(404).send('Penerbit tidak ditemukan');
      }

      res.redirect('/admin/publishers');
    } catch (error) {
      console.error("DELETE PUBLISHER ERROR:", error);
      res.status(500).send('Gagal menghapus penerbit');
    }
  }
};