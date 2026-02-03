'use strict';
const { Book, User, Ruangan, Sequelize } = require('../models');

const getSuperDashboard = async (req, res) => {
    try {
        // 1. Ambil Total Buku (Global)
        const totalBooks = await Book.count();

        // 2. Ambil Total Ruangan (Jumlahnya saja)
        const totalRuangan = await Ruangan.count();

        // 3. Ambil Daftar Ruangan beserta Jumlah Buku di dalamnya
        // Menggunakan subquery untuk performa yang lebih baik daripada include all
        const roomsData = await Ruangan.findAll({
            attributes: [
                'id_ruangan',
                'nama_ruangan',
                [Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM Books AS b
                    WHERE b.id_ruangan = Ruangan.id_ruangan
                )`), 'total_koleksi']
            ],
            order: [['nama_ruangan', 'ASC']]
        });

        // Kirim data ke view
        res.render('super-admin/super-admin-dashboard', {
            title: 'Super Admin Dashboard',
            user: req.session.user ? req.session.user.username : 'Admin',
            role: req.session.user ? req.session.user.role : 'super_admin',
            stats: {
                totalBooks,
                totalRuangan,
                roomsData // Data array ruangan + jumlah buku
            }
        });
    } catch (error) {
        console.error("Error loading Super Admin Dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getSuperDashboard
};