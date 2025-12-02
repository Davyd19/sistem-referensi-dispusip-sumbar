const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Route Halaman Utama
router.get('/', bookController.index);

// Route Proses Pencarian
router.get('/search', bookController.search);

// Route Halaman Detail Buku
router.get('/book/:id', bookController.detail);

module.exports = router;