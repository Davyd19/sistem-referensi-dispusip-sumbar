const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database'); // Import koneksi DB
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = 3000;

// Test Koneksi Database sebelum server jalan
db.authenticate()
    .then(() => console.log('Database terhubung via Sequelize!'))
    .catch(err => console.error('Gagal koneksi database:', err));

// Sinkronisasi Model (Opsional: Membuat tabel jika belum ada)
// db.sync(); 

// Set View Engine ke EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware untuk file statis
app.use(express.static(path.join(__dirname, 'public')));

// Middleware parsing body request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routing Utama
app.use('/', bookRoutes);

app.listen(PORT, () => {
    console.log(`Sistem Referensi berjalan di http://localhost:${PORT}`);
});