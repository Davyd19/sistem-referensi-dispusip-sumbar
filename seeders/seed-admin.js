'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    async up(queryInterface, Sequelize) {
        const passwordSuper = bcrypt.hashSync('admin123', 10);
        const passwordRuangan = bcrypt.hashSync('ruangan123', 10);

        // 1. Masukkan data ke tabel 'users'
        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                username: 'admin',
                password: passwordSuper,
                role: 'super_admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 2,
                username: 'admin_referensi',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 3,
                username: 'admin_tandon',
                password: passwordRuangan,
                role: 'admin_ruangan',
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);

        // 2. Hubungkan admin ke tabel 'ruangan'
        await queryInterface.bulkInsert('ruangan', [
            {
                id_ruangan: 1,
                nama_ruangan: 'Ruangan Referensi',
                id_admin_ruangan: 2, // Merujuk ke id admin_referensi
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id_ruangan: 2,
                nama_ruangan: 'Ruangan Tandon',
                id_admin_ruangan: 3, // Merujuk ke id admin_tandon
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // Hapus data dari kedua tabel dalam urutan yang benar (child first)
        await queryInterface.bulkDelete('ruangan', null, {});
        await queryInterface.bulkDelete('users', {
            username: ['admin', 'admin_referensi', 'admin_tandon']
        }, {});
    }
};