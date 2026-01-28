const { Publisher, Ruangan, Book, Sequelize } = require('../models');

module.exports = {
  // Menampilkan halaman list penerbit
  index: async (req, res) => {
    try {
      const adminId = req.user.id;
      
      // 1. Ambil data ruangan berdasarkan admin yang login
      const ruanganAdmin = await Ruangan.findOne({ 
        where: { id_admin_ruangan: adminId } 
      });

      const idRuangan = ruanganAdmin ? ruanganAdmin.id_ruangan : null;

      // 2. Ambil semua penerbit global dengan hitungan buku di ruangan tersebut
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
        order: [['name', 'ASC']]
      });

      res.render('admin/publisher', {
        title: 'Kelola Penerbit',
        // Mengirimkan namaRuangan agar muncul di header.ejs
        namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : 'Semua Ruangan',
        publishers,
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
      
      // Cek relasi di tabel junction (BookPublishers)
      const { BookPublisher } = require('../models');
      const count = await BookPublisher.count({ where: { publisher_id: id } });

      if (count > 0) {
        return res.status(400).send('Gagal: Penerbit masih digunakan oleh data buku.');
      }

      await Publisher.destroy({ where: { id } });
      res.redirect('/admin/publishers');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal menghapus penerbit');
    }
  }
};