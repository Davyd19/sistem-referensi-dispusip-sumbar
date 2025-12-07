const express = require("express");
const router = express.Router();
const adminBookController = require("../controllers/admin.controller");
const upload = require("../middleware/imageMiddleware")();

// =========================
// LIST BUKU
// =========================
router.get("/books", adminBookController.listBooks);

// =========================
// TAMBAH BUKU
// =========================
router.get("/books/add", adminBookController.showAddPage);
router.post(
    "/books/add",
    upload.single("image"),
    adminBookController.addBook
);

// =========================
// EDIT & UPDATE BUKU
// =========================
router.get("/books/edit/:id", adminBookController.showEditPage);
router.post(
    "/books/edit/:id",
    upload.single("image"),
    adminBookController.updateBook
);

// =========================
// DELETE BUKU
// =========================
router.get("/books/delete/:id", adminBookController.deleteBook);

// =========================
// AUTOCOMPLETE
// =========================
router.get("/autocomplete/category", adminBookController.findCategory);
router.get("/autocomplete/author", adminBookController.findAuthor);
router.get("/autocomplete/publisher", adminBookController.findPublisher);
router.get("/autocomplete/subject", adminBookController.findSubject);

module.exports = router;