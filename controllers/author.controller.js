const { Author, Ruangan, Book, Sequelize } = require('../models');

module.exports = {
  // Menampilkan halaman list penulis
  index: async (req, res) => {
    try {
      const adminId = req.user.id;
      
      // 1. Ambil data ruangan berdasarkan admin yang login
      const ruanganAdmin = await Ruangan.findOne({ 
        where: { id_admin_ruangan: adminId } 
      });

      const idRuangan = ruanganAdmin ? ruanganAdmin.id_ruangan : null;

      // 2. Ambil semua penulis dengan hitungan buku di ruangan tersebut
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
        order: [['name', 'ASC']]
      });

      res.render('admin/author', {
        title: 'Kelola Penulis',
        // Mengirimkan namaRuangan ke header
        namaRuangan: ruanganAdmin ? ruanganAdmin.nama_ruangan : 'Semua Ruangan',
        authors,
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
  destroy: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Proteksi: Jangan hapus jika penulis masih punya buku (Global)
      const { BookAuthor } = require('../models');
      const count = await BookAuthor.count({ where: { author_id: id } });
      
      if (count > 0) {
        return res.status(400).send('Gagal: Penulis masih terikat dengan data buku.');
      }

      await Author.destroy({ where: { id } });
      res.redirect('/admin/authors');
    } catch (error) {
      console.error(error);
      res.status(500).send('Gagal menghapus penulis');
    }
  }
};