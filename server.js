const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk memparsing JSON dan file statis
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Rute utama untuk melayani file index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// (Opsional) Endpoint untuk mengambil daftar user jika Anda menggunakannya 
// untuk fitur Chat Antar User dinamis ke database Anda.
app.get('/api/users', async (req, res) => {
    try {
        // Sesuaikan dengan logika database Anda (Firestore / Supabase / dll)
        // Contoh data dummy/placeholder jika diperlukan:
        const users = []; 
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Gagal memuat daftar user" });
    }
});

// Menjalankan server lokal
app.listen(PORT, () => {
    console.log(`Server KDP Doku Sign berjalan di port ${PORT}`);
});