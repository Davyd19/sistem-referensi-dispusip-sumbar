const { Op } = require("sequelize");
const { Book, Author, Publisher, Subject, Category } = require("../models");

module.exports = {
    indexPage: async (req, res) => {
        try {
            const {
                q = "",
                searchBy = "title",
                matchType = "contains",
                category = "",
                subject = "",
                year = "",
                page = 1,
                limit = 12
            } = req.query;

            const currentPage = parseInt(page);
            const perPage = parseInt(limit);
            const offset = (currentPage - 1) * perPage;

            // =========================
            // MATCH TYPE
            // =========================
            let searchValue = q;
            let operator = Op.like;

            switch (matchType) {
                case "startsWith":
                    searchValue = `${q}%`;
                    break;
                case "endsWith":
                    searchValue = `%${q}`;
                    break;
                case "exact":
                    operator = Op.eq;
                    break;
                default:
                    searchValue = `%${q}%`;
            }

            // =========================
            // INCLUDE (DEFAULT – TIDAK TERFILTER)
            // =========================
            const includeOptions = [
                { model: Author, through: { attributes: [] }, required: false },
                { model: Publisher, through: { attributes: [] }, required: false },
                { model: Subject, through: { attributes: [] }, required: false },
                { model: Category, required: false }
            ];

            // =========================
            // WHERE CONDITION (BOOK)
            // =========================
            const whereCondition = {};

            if (category) {
                whereCondition.category_id = category;
            }

            if (year) {
                whereCondition.publish_year = year;
            }

            // =========================
            // FILTER SUBJECT (AMAN)
            // =========================
            if (subject) {
                includeOptions[2].required = true;
                includeOptions[2].where = {
                    id: subject
                };
            }

            // =========================
            // SEARCH HANDLER
            // =========================
            if (q) {
                switch (searchBy) {
                    case "title":
                        whereCondition.title = { [operator]: searchValue };
                        break;

                    case "call_number":
                        whereCondition.call_number = { [operator]: searchValue };
                        break;

                    case "author":
                        includeOptions[0].required = true;
                        includeOptions[0].where = { name: { [operator]: searchValue } };
                        break;

                    case "publisher":
                        includeOptions[1].required = true;
                        includeOptions[1].where = { name: { [operator]: searchValue } };
                        break;

                    case "subject":
                        includeOptions[2].required = true;
                        includeOptions[2].where = { name: { [operator]: searchValue } };
                        break;

                    case "all":
                        whereCondition[Op.or] = [
                            { title: { [operator]: searchValue } },
                            { call_number: { [operator]: searchValue } }
                        ];

                        includeOptions.slice(0, 3).forEach(inc => {
                            inc.required = false;
                        });
                        break;
                }
            }

            // =========================
            // QUERY BUKU
            // =========================
            const { count, rows } = await Book.findAndCountAll({
                where: whereCondition,
                include: includeOptions,
                limit: perPage,
                offset,
                order: [["id", "DESC"]],
                distinct: true
            });

            // =========================
            // SIDEBAR DATA (FULL, TIDAK TERFILTER)
            // =========================
            const categories = await Category.findAll({
                order: [["name", "ASC"]]
            });

            const subjects = await Subject.findAll({
                order: [["name", "ASC"]]
            });

            const yearsRaw = await Book.findAll({
                attributes: [
                    [Book.sequelize.fn("DISTINCT", Book.sequelize.col("publish_year")), "year"]
                ],
                where: { publish_year: { [Op.ne]: null } },
                raw: true,
                order: [[Book.sequelize.col("year"), "DESC"]]
            });

            // =========================
            // IMAGE PATH
            // =========================
            const books = rows.map(book => ({
                ...book.get(),
                image_full_path: book.image ? `/image/uploads/${book.image}` : null
            }));

            return res.render("user/index", {
                title: "Katalog Buku",
                books,
                totalItems: count,
                currentPage,
                totalPages: Math.ceil(count / perPage),
                sidebarData: {
                    categories,
                    subjects,
                    years: yearsRaw
                },
                query: {
                    q,
                    searchBy,
                    matchType,
                    category,
                    subject,
                    year
                }
            });

        } catch (err) {
            console.error("Error Search Index:", err);
            return res.status(500).send("Internal Server Error");
        }
    }
};