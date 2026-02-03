'use strict';

const { Book, Author, Category, BookCopy, BookAuthor } = require('../models'); // Sesuaikan path jika perlu

module.exports = {
  async up (queryInterface, Sequelize) {
    
    // --- DATA 50 BUKU (BERBAGAI KATEGORI DDC) ---
    const booksData = [
      // 000 - Karya Umum & Komputer
      { title: "Pengantar Ilmu Komputer", author: "Jogiyanto", category: "Komputer", call_number: "004 JOG p", stock: 2 },
      { title: "Algoritma dan Pemrograman", author: "Rinaldi Munir", category: "Komputer", call_number: "005.1 RIN a", stock: 3 },
      { title: "Dasar-Dasar Jurnalisme", author: "Luwi Ishwara", category: "Jurnalisme", call_number: "070 LUW d", stock: 1 },
      { title: "Ensiklopedia Pengetahuan Umum", author: "Tim Redaksi", category: "Ensiklopedia", call_number: "030 TIM e", stock: 1 },
      { title: "Sistem Informasi Manajemen", author: "Raymond McLeod", category: "Komputer", call_number: "005.3 RAY s", stock: 2 },

      // 100 - Filsafat & Psikologi
      { title: "Filosofi Teras", author: "Henry Manampiring", category: "Filsafat", call_number: "100 HEN f", stock: 5 },
      { title: "Psikologi Kepribadian", author: "Alwisol", category: "Psikologi", call_number: "155.2 ALW p", stock: 2 },
      { title: "Berani Tidak Disukai", author: "Ichiro Kishimi", category: "Psikologi", call_number: "158 ICH b", stock: 3 },
      { title: "Dunia Sophie", author: "Jostein Gaarder", category: "Filsafat", call_number: "109 JOS d", stock: 2 },
      { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psikologi", call_number: "153 DAN t", stock: 1 },

      // 200 - Agama
      { title: "Sejarah Hidup Muhammad", author: "Muhammad Husain Haekal", category: "Agama", call_number: "297.9 MUH s", stock: 3 },
      { title: "Fiqih Sunnah Wanita", author: "Abu Malik Kamal", category: "Agama", call_number: "297.4 ABU f", stock: 2 },
      { title: "Tafsir Al-Mishbah Vol 1", author: "M. Quraish Shihab", category: "Agama", call_number: "297.1 QUR t", stock: 1 },
      { title: "Islam Ditinjau dari Berbagai Aspek", author: "Harun Nasution", category: "Agama", call_number: "297 HAR i", stock: 2 },
      { title: "Riyaadhu Ash-Shaliheen", author: "Imam An-Nawawi", category: "Agama", call_number: "297.2 IMA r", stock: 4 },

      // 300 - Ilmu Sosial
      { title: "Sosiologi: Suatu Pengantar", author: "Soerjono Soekanto", category: "Sosiologi", call_number: "301 SOE s", stock: 5 },
      { title: "Pengantar Ilmu Hukum", author: "R. Soeroso", category: "Hukum", call_number: "340 SOE p", stock: 3 },
      { title: "Ekonomi Pembangunan", author: "Lincolin Arsyad", category: "Ekonomi", call_number: "330 LIN e", stock: 2 },
      { title: "Dasar-Dasar Ilmu Politik", author: "Miriam Budiardjo", category: "Politik", call_number: "320 MIR d", stock: 2 },
      { title: "Manajemen Pendidikan", author: "Mulyasa", category: "Pendidikan", call_number: "370 MUL m", stock: 2 },

      // 400 - Bahasa
      { title: "Tata Bahasa Baku Bahasa Indonesia", author: "Hasan Alwi", category: "Bahasa", call_number: "499.21 HAS t", stock: 3 },
      { title: "English Grammar in Use", author: "Raymond Murphy", category: "Bahasa", call_number: "425 RAY e", stock: 4 },
      { title: "Kamus Lengkap Inggris-Indonesia", author: "John M. Echols", category: "Bahasa", call_number: "423 JOH k", stock: 2 },
      { title: "Linguistik Umum", author: "Abdul Chaer", category: "Bahasa", call_number: "410 ABD l", stock: 2 },
      { title: "Mahir Bahasa Arab", author: "A. Zakaria", category: "Bahasa", call_number: "492 ZAK m", stock: 2 },

      // 500 - Sains & Matematika
      { title: "Kalkulus Edisi 9", author: "Dale Varberg", category: "Matematika", call_number: "515 DAL k", stock: 2 },
      { title: "Biologi Dasar", author: "Campbell", category: "Biologi", call_number: "570 CAM b", stock: 3 },
      { title: "Fisika Dasar Jilid 1", author: "Halliday Resnick", category: "Fisika", call_number: "530 HAL f", stock: 2 },
      { title: "Kimia Organik", author: "Fessenden", category: "Kimia", call_number: "547 FES k", stock: 2 },
      { title: "Kosmos", author: "Carl Sagan", category: "Astronomi", call_number: "520 CAR k", stock: 1 },

      // 600 - Teknologi
      { title: "Teknik Sipil", author: "Ir. Sunggono", category: "Teknik", call_number: "624 SUN t", stock: 2 },
      { title: "Ilmu Gizi Dasar", author: "Sunita Almatsier", category: "Kesehatan", call_number: "613 SUN i", stock: 3 },
      { title: "Manajemen Pemasaran", author: "Philip Kotler", category: "Bisnis", call_number: "658 PHI m", stock: 2 },
      { title: "Cara Bercocok Tanam", author: "Trubus", category: "Pertanian", call_number: "630 TRU c", stock: 2 },
      { title: "Resep Masakan Nusantara", author: "Sisca Soewitomo", category: "Tata Boga", call_number: "641 SIS r", stock: 1 },

      // 700 - Kesenian & Rekreasi
      { title: "Sejarah Seni Rupa Indonesia", author: "Soedarso Sp", category: "Seni", call_number: "709 SOE s", stock: 1 },
      { title: "Desain Grafis Indonesia", author: "Hanny Kardinata", category: "Desain", call_number: "741 HAN d", stock: 2 },
      { title: "Teknik Fotografi Digital", author: "Arbain Rambey", category: "Fotografi", call_number: "770 ARB t", stock: 2 },
      { title: "Teori Musik Dasar", author: "Pono Banoe", category: "Musik", call_number: "780 PON t", stock: 2 },
      { title: "Strategi Catur Modern", author: "Utut Adianto", category: "Olahraga", call_number: "794 UTU s", stock: 1 },

      // 800 - Kesusastraan (Fiksi/Novel)
      { title: "Laskar Pelangi", author: "Andrea Hirata", category: "Novel", call_number: "813 AND l", stock: 5 },
      { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", category: "Novel", call_number: "813 PRA b", stock: 3 },
      { title: "Cantik Itu Luka", author: "Eka Kurniawan", category: "Novel", call_number: "813 EKA c", stock: 2 },
      { title: "Pulang", author: "Leila S. Chudori", category: "Novel", call_number: "813 LEI p", stock: 2 },
      { title: "Hujan", author: "Tere Liye", category: "Novel", call_number: "813 TER h", stock: 4 },

      // 900 - Sejarah & Geografi
      { title: "Sejarah Nasional Indonesia", author: "Sartono Kartodirdjo", category: "Sejarah", call_number: "959.8 SAR s", stock: 2 },
      { title: "Sapiens: Riwayat Singkat Umat Manusia", author: "Yuval Noah Harari", category: "Sejarah", call_number: "909 YUV s", stock: 3 },
      { title: "Guns, Germs, and Steel", author: "Jared Diamond", category: "Sejarah", call_number: "900 JAR g", stock: 1 },
      { title: "Atlas Dunia Lengkap", author: "Tim Geografi", category: "Geografi", call_number: "912 TIM a", stock: 2 },
      { title: "Biografi Soekarno", author: "Cindy Adams", category: "Biografi", call_number: "920 CIN b", stock: 2 }
    ];

    console.log("Mulai seeding 50 buku...");

    for (const data of booksData) {
      // 1. Find or Create Author
      let [author] = await Author.findOrCreate({
        where: { name: data.author }
      });

      // 2. Find or Create Category
      let [category] = await Category.findOrCreate({
        where: { name: data.category }
      });

      // 3. Create Book
      // Kita gunakan random ISBN dummy
      const dummyISBN = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
      
      const book = await Book.create({
        title: toTitleCase(data.title),
        edition: 'Pertama',
        publish_year: 2015 + Math.floor(Math.random() * 8), // Random tahun 2015-2023
        publish_place: 'Jakarta',
        physical_description: '200 hlm; 21 cm',
        isbn: dummyISBN,
        call_number: data.call_number,
        language: 'Indonesia',
        category_id: category.id,
        id_ruangan: 1, // Default Gudang Utama
        stock_total: data.stock,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // 4. Link Author to Book
      await BookAuthor.create({
        book_id: book.id,
        author_id: author.id,
        role: 'penulis'
      });

      // 5. Create Book Copies (Stok Fisik) -> Ini yang masuk ke PUSKEL
      // Format No Induk: B001, B002, dst (Kita generate unik dummy)
      for (let i = 0; i < data.stock; i++) {
        // Generate nomor induk unik per loop agar tidak duplikat
        // Format: PUS-[BookID]-[Index] contoh: PUS-1-0, PUS-1-1
        const noInduk = `PUS-${book.id}-${i + 1}`; 
        
        await BookCopy.create({
          book_id: book.id,
          no_induk: noInduk,
          condition: 'baik',
          status: 'tersedia_puskel', // Langsung set tersedia untuk Puskel
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    console.log("Seeding selesai! 50 Buku berhasil ditambahkan.");
  },

  async down (queryInterface, Sequelize) {
    // Hapus data saat undo seed
    await queryInterface.bulkDelete('book_copies', null, {});
    await queryInterface.bulkDelete('book_authors', null, {});
    await queryInterface.bulkDelete('books', null, {});
    await queryInterface.bulkDelete('authors', null, {});
    await queryInterface.bulkDelete('categories', null, {});
  }
};

// Helper Title Case
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}