// controllers/room.controller.js
const { Ruangan, User, Book, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
    // 1. TAMPILKAN DAFTAR RUANGAN
    index: async (req, res) => {
        try {
            const rooms = await Ruangan.findAll({
                include: [{ 
                    model: User, 
                    as: 'admin',
                    attributes: ['username'] // Ambil username adminnya
                }],
                order: [['createdAt', 'DESC']]
            });
            const bookCounts = await Book.findAll({
                attributes: ['id_ruangan', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                group: ['id_ruangan'],
                raw: true
            });
            const countMap = {};
            bookCounts.forEach(r => { countMap[r.id_ruangan] = parseInt(r.count, 10) || 0; });
            rooms.forEach(r => { r._bookCount = countMap[r.id_ruangan] || 0; });

            res.render('super-admin/room_list', {
                title: 'Kelola Ruangan',
                rooms,
                user: req.session.user,
                active: 'rooms',
                query: req.query
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    },

    // 2. TAMPILKAN FORM TAMBAH
    showAdd: (req, res) => {
        res.render('super-admin/room_add', {
            title: 'Tambah Ruangan Baru',
            user: req.session.user,
            error: null,
            query: req.query
        });
    },

    // 3. PROSES SIMPAN RUANGAN (DAN USER ADMINNYA)
    store: async (req, res) => {
        const t = await sequelize.transaction(); // Mulai transaksi database
        
        try {
            const { nama_ruangan, username, password, layout_json } = req.body;

            // Validasi sederhana
            if (!nama_ruangan || !username || !password) {
                return res.render('super-admin/room_add', {
                    title: 'Tambah Ruangan',
                    user: req.session.user,
                    error: "Semua kolom wajib diisi!"
                });
            }

            // Parse & validasi layout (wajib ada denah dengan minimal 1 item)
            let parsedLayout = null;
            if (layout_json && String(layout_json).trim()) {
                try {
                    parsedLayout = JSON.parse(layout_json);
                } catch (e) {
                    return res.render('super-admin/room_add', {
                        title: 'Tambah Ruangan',
                        user: req.session.user,
                        error: "Format desain ruangan tidak valid (JSON rusak)."
                    });
                }
            }
            const items = parsedLayout && Array.isArray(parsedLayout.items) ? parsedLayout.items : [];
            if (items.length === 0) {
                return res.render('super-admin/room_add', {
                    title: 'Tambah Ruangan',
                    user: req.session.user,
                    error: "Desain denah ruangan wajib diisi. Tambahkan minimal satu item (rak, meja, atau pintu) ke denah sebelum menyimpan."
                });
            }
            const rows = Math.min(60, Math.max(4, parseInt(parsedLayout?.rows, 10) || 25));
            const cols = Math.min(60, Math.max(4, parseInt(parsedLayout?.cols, 10) || 40));
            parsedLayout.rows = rows;
            parsedLayout.cols = cols;

            // Cek apakah username sudah ada
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.render('super-admin/room_add', {
                    title: 'Tambah Ruangan',
                    user: req.session.user,
                    error: "Username admin sudah digunakan!"
                });
            }

            // A. Buat User Admin Ruangan dulu
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                username,
                password: hashedPassword,
                role: 'admin_ruangan'
            }, { transaction: t });

            // B. Buat Ruangan yang terhubung ke User tersebut
            await Ruangan.create({
                nama_ruangan,
                id_admin_ruangan: newUser.id,
                layout_json: parsedLayout
            }, { transaction: t });

            // Commit transaksi jika sukses
            await t.commit();

            res.redirect('/admin/rooms?success=created');

        } catch (err) {
            // Rollback jika terjadi error
            await t.rollback();
            console.error(err);
            res.render('super-admin/room_add', {
                title: 'Tambah Ruangan',
                user: req.session.user,
                error: "Terjadi kesalahan sistem: " + err.message
            });
        }
    },

    // 4. TAMPILKAN FORM EDIT
    showEdit: async (req, res) => {
        try {
            const room = await Ruangan.findByPk(req.params.id, {
                attributes: ['id_ruangan', 'nama_ruangan', 'id_admin_ruangan', 'layout_json'],
                include: [{ model: User, as: 'admin' }]
            });

            if (!room) return res.status(404).send("Ruangan tidak ditemukan");

            res.render('super-admin/room_edit', {
                title: 'Edit Ruangan',
                room,
                user: req.session.user,
                error: null,
                query: req.query
            });
        } catch (err) {
            console.error(err);
            res.status(500).send("Error");
        }
    },

    // 5. PROSES UPDATE
    update: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { nama_ruangan, username, new_password, layout_json } = req.body;

            const room = await Ruangan.findByPk(id, { include: ['admin'] });
            if (!room) return res.status(404).send("Ruangan tidak ditemukan");

            // Parse & validasi layout (opsional). Hanya update layout jika ada JSON valid.
            const roomUpdate = { nama_ruangan };
            if (layout_json != null && String(layout_json).trim() !== '') {
                try {
                    const parsed = JSON.parse(layout_json);
                    parsed.rows = Math.min(60, Math.max(4, parseInt(parsed?.rows, 10) || 25));
                    parsed.cols = Math.min(60, Math.max(4, parseInt(parsed?.cols, 10) || 40));
                    roomUpdate.layout_json = parsed;
                } catch (e) {
                    return res.redirect(`/admin/rooms/edit/${id}?error=layout`);
                }
            }

            await room.update(roomUpdate, { transaction: t });

            // Update Info Admin (User)
            const updateData = { username };
            if (new_password) {
                updateData.password = await bcrypt.hash(new_password, 10);
            }
            
            await User.update(updateData, { 
                where: { id: room.id_admin_ruangan },
                transaction: t 
            });

            await t.commit();
            res.redirect('/admin/rooms?success=updated');

        } catch (err) {
            await t.rollback();
            console.error(err);
            res.redirect(`/admin/rooms/edit/${req.params.id}?error=gagal`);
        }
    },

    // 6. HAPUS RUANGAN (BUKU DI RUANGAN, DAN ADMIN)
    delete: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const { confirm_username, confirm_password } = req.body || {};

            if (!confirm_username || !confirm_password) {
                await t.rollback();
                return res.redirect('/admin/rooms?error_delete=Username dan password wajib diisi.');
            }

            const superAdmin = await User.findOne({
                where: { username: confirm_username.trim(), role: 'super_admin' }
            });
            if (!superAdmin || !(await bcrypt.compare(confirm_password, superAdmin.password))) {
                await t.rollback();
                return res.redirect('/admin/rooms?error_delete=Username atau password Super Admin salah.');
            }

            const room = await Ruangan.findByPk(id);
            if (!room) return res.status(404).send("Data tidak ditemukan");

            const adminId = room.id_admin_ruangan;
            const idRuangan = room.id_ruangan;

            // 1. Hapus semua buku di ruangan ini (termasuk copy & relasi via cascade/hooks)
            await Book.destroy({ where: { id_ruangan: idRuangan }, transaction: t });

            // 2. Hapus Ruangan
            await room.destroy({ transaction: t });

            // 3. Hapus User Admin ruangan
            if (adminId) {
                await User.destroy({ where: { id: adminId }, transaction: t });
            }

            await t.commit();
            res.redirect('/admin/rooms?success=deleted');

        } catch (err) {
            await t.rollback();
            console.error(err);
            res.redirect('/admin/rooms?error_delete=Gagal menghapus data.');
        }
    }
};