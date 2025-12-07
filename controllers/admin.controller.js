const { Book, Category, Author, Publisher, Subject } = require("../models");
const { Op } = require("sequelize");

module.exports = {
    // =========================
    // LIST BUKU
    // =========================
    listBooks: async (req, res) => {
        try {
            const q = req.query.q || "";

            const books = await Book.findAll({
                where: q ? { title: { [Op.like]: `%${q}%` } } : {},
                include: [
                    { model: Category },
                    { model: Author, as: 'Authors' },
                    { model: Publisher, as: 'Publishers' },
                    { model: Subject, as: 'Subjects' }
                ],
                order: [['id', 'ASC']]
            });

            res.render("admin/admin_books_list", {
                title: "Daftar Buku",
                books,
                q
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal memuat daftar buku");
        }
    },

    // =========================
    // SHOW HALAMAN TAMBAH BUKU
    // =========================
    showAddPage: async (req, res) => {
        try {
            const categories = await Category.findAll();
            const authors = await Author.findAll();
            const publishers = await Publisher.findAll();
            const subjects = await Subject.findAll();

            res.render("admin/admin_add_book", {
                title: "Tambah Buku",
                categories,
                authors,
                publishers,
                subjects
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal memuat halaman tambah buku");
        }
    },

    // =========================
    // ADD BOOK
    // =========================
    addBook: async (req, res) => {
        try {
            const data = req.body;

            // Handle category
            let categoryId = null;
            if (data.category_id) {
                const categoriesArray = Array.isArray(data.category_id) ? data.category_id : [data.category_id];
                let cat = categoriesArray[0];
                if (isNaN(cat)) {
                    const newCategory = await Category.create({ name: String(cat) });
                    categoryId = newCategory.id;
                } else {
                    categoryId = cat;
                }
            }

            // Handle authors
            let authorIds = [];
            if (data.authors) {
                const authorsArray = Array.isArray(data.authors) ? data.authors : [data.authors];
                for (let a of authorsArray) {
                    if (isNaN(a)) {
                        const newAuthor = await Author.create({ name: String(a) });
                        authorIds.push(newAuthor.id);
                    } else {
                        authorIds.push(a);
                    }
                }
            }

            // Handle publishers
            let publisherIds = [];
            if (data.publishers) {
                const publishersArray = Array.isArray(data.publishers) ? data.publishers : [data.publishers];
                for (let p of publishersArray) {
                    if (isNaN(p)) {
                        const newPublisher = await Publisher.create({ name: String(p) });
                        publisherIds.push(newPublisher.id);
                    } else {
                        publisherIds.push(p);
                    }
                }
            }

            // Handle subjects
            let subjectIds = [];
            if (data.subjects) {
                const subjectsArray = Array.isArray(data.subjects) ? data.subjects : [data.subjects];
                for (let s of subjectsArray) {
                    if (isNaN(s)) {
                        const newSubject = await Subject.create({ name: String(s) });
                        subjectIds.push(newSubject.id);
                    } else {
                        subjectIds.push(s);
                    }
                }
            }

            // CREATE BOOK
            const book = await Book.create({
                title: data.title,
                original_title: data.original_title,
                statement_of_responsibility: data.statement_of_responsibility,
                series_title: data.series_title,
                edition: data.edition,
                publish_year: data.publish_year,
                publish_place: data.publish_place,
                physical_description: data.physical_description,
                content_type: data.content_type,
                media_type: data.media_type,
                carrier_type: data.carrier_type,
                isbn: data.isbn,
                call_number: data.call_number,
                abstract: data.abstract,
                notes: data.notes,
                language: data.language,
                work_type: data.work_type,
                target_audience: data.target_audience,
                stock_total: data.stock_total,
                stock_available: data.stock_available,
                category_id: categoryId,
                image: req.file ? req.file.filename : null,
                shelf_location: data.shelf_location
            });

            // SET RELATIONS
            if (authorIds.length) await book.setAuthors(authorIds);
            if (publisherIds.length) await book.setPublishers(publisherIds);
            if (subjectIds.length) await book.setSubjects(subjectIds);

            res.redirect("/admin/books");

        } catch (err) {
            console.log("Error creating book:", err);
            res.status(500).send("Error creating book: " + err.message);
        }
    },

    // =========================
    // SHOW HALAMAN EDIT BUKU
    // =========================
    showEditPage: async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id, {
                include: [Category, Author, Publisher, Subject]
            });
            const categories = await Category.findAll();
            const authors = await Author.findAll();
            const publishers = await Publisher.findAll();
            const subjects = await Subject.findAll();

            if (!book) return res.status(404).send("Buku tidak ditemukan");

            res.render("admin/admin_edit_book", {
                title: "Edit Buku",
                book,
                categories,
                authors,
                publishers,
                subjects
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal memuat halaman edit buku");
        }
    },

    // =========================
    // UPDATE BOOK
    // =========================
    updateBook: async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id);
            if (!book) return res.status(404).send("Buku tidak ditemukan");

            const data = req.body;

            await book.update({
                title: data.title,
                original_title: data.original_title,
                statement_of_responsibility: data.statement_of_responsibility,
                series_title: data.series_title,
                edition: data.edition,
                publish_year: data.publish_year,
                publish_place: data.publish_place,
                physical_description: data.physical_description,
                content_type: data.content_type,
                media_type: data.media_type,
                carrier_type: data.carrier_type,
                isbn: data.isbn,
                call_number: data.call_number,
                abstract: data.abstract,
                notes: data.notes,
                language: data.language,
                work_type: data.work_type,
                target_audience: data.target_audience,
                stock_total: data.stock_total,
                stock_available: data.stock_available,
                category_id: Array.isArray(data.category_id) ? data.category_id[0] : data.category_id || null,
                shelf_location: data.shelf_location,
                image: req.file ? req.file.filename : book.image
            });

            // Update relasi many-to-many
            if (data.authors) await book.setAuthors(Array.isArray(data.authors) ? data.authors : [data.authors]);
            if (data.publishers) await book.setPublishers(Array.isArray(data.publishers) ? data.publishers : [data.publishers]);
            if (data.subjects) await book.setSubjects(Array.isArray(data.subjects) ? data.subjects : [data.subjects]);

            res.redirect("/admin/books");
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal memperbarui buku: " + err.message);
        }
    },

    // =========================
    // DELETE BOOK
    // =========================
    deleteBook: async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id);
            if (!book) return res.status(404).send("Buku tidak ditemukan");

            await book.destroy();
            res.redirect("/admin/books");
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal menghapus buku");
        }
    },

    // =========================
    // AUTOCOMPLETE FUNCTIONS
    // =========================
    findCategory: async (req, res) => {
        try {
            const q = req.query.q || "";
            const categories = await Category.findAll({
                where: { name: { [Op.like]: `%${q}%` } },
                limit: 10
            });
            res.json(categories);
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal mencari kategori");
        }
    },

    findAuthor: async (req, res) => {
        try {
            const q = req.query.q || "";
            const authors = await Author.findAll({
                where: { name: { [Op.like]: `%${q}%` } },
                limit: 10
            });
            res.json(authors);
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal mencari author");
        }
    },

    findPublisher: async (req, res) => {
        try {
            const q = req.query.q || "";
            const publishers = await Publisher.findAll({
                where: { name: { [Op.like]: `%${q}%` } },
                limit: 10
            });
            res.json(publishers);
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal mencari publisher");
        }
    },

    findSubject: async (req, res) => {
        try {
            const q = req.query.q || "";
            const subjects = await Subject.findAll({
                where: { name: { [Op.like]: `%${q}%` } },
                limit: 10
            });
            res.json(subjects);
        } catch (err) {
            console.log(err);
            res.status(500).send("Gagal mencari subject");
        }
    }
};