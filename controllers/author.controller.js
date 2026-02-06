const { Author, Ruangan, Book, Sequelize } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  // Menampilkan halaman list penulis
  index: async (req, res) => {
    try {
      // 1. Ambil query 'q' dari URL (pencarian)
      const q = req.query.q || '';
      const adminId = req.user.id;
      
      // 2. Ambil data ruangan berdasarkan admin yang login
      const ruanganAdmin = await Ruangan.findOne({ 
        where: { id_admin_ruangan: adminId } 
      });

      const idRuangan = ruanganAdmin ? ruanganAdmin.id_ruangan : null;

      // 3. Ambil penulis dengan filter pencarian dan hitungan buku
      const authors = await Author.findAll({
        attributes: [
          'id', 
          'name', 
          'createdAt',
          [Sequelize.literal(`(
            SELECT COUNT(*) FROM BookAuthors AS ba
            JOIN Books AS b ON ba.book_id = b.id
            WHERE ba.author_id = Author.id
            ${idRuangan ? `AND b.id_ruangan = ${idRuangan}` : ''}
          )`), 'total_books']
        ],
        // 🔑 Tambahkan logika WHERE untuk search
        where: q ? {
          name: { [Op.like]: `%${q}%` }
        } : {},
        order: [['name', 'ASC']]
      });

      res.render('admin/author', {
        title: 'Kelola Penulis',
        namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : 'Semua Ruangan',
        authors,
        q, // 🔑 Kirim variabel q agar bisa ditampilkan di input search EJS
        user: req.user,
        active: 'authors'
      });
    } catch (error) {
      console.error("AUTHOR INDEX ERROR:", error);
      res.status(500).send('Internal Server Error');
    }
  },

  // Menambah penulis baru (Global)
  store: async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || name.trim() === '') return res.status(400).send('Nama wajib diisi');

      // Gunakan findOrCreate agar tidak duplikat secara global
      await Author.findOrCreate({
        where: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('name')), 
          name.toLowerCase().trim()
        ),
        defaults: { name: name.trim() }
      });

      res.redirect('/admin/authors');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal menambahkan penulis');
    }
  },

  // Mengupdate data penulis
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      await Author.update({ name: name.trim() }, { where: { id } });
      res.redirect('/admin/authors');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal mengupdate penulis');
    }
  },

  // Menghapus penulis
  // Menghapus penulis
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      
      /** * Hapus bagian pengecekan BookAuthor.count.
       * Karena di migrasi sudah ada onDelete: 'CASCADE', 
       * menghapus Author akan otomatis menghapus baris terkait di BookAuthors.
       */
      const result = await Author.destroy({ where: { id } });
      
      if (result === 0) {
        return res.status(404).send('Penulis tidak ditemukan');
      }

      res.redirect('/admin/authors');
    } catch (error) {
      console.error("DELETE AUTHOR ERROR:", error);
      res.status(500).send('Gagal menghapus penulis');
    }
  }
};