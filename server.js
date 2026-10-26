const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();

// Middleware untuk memparsing JSON dari request body
app.use(express.json());

// 1. Menyajikan file statis (HTML, gambar, script) dari folder utama
app.use(express.static(path.join(__dirname)));

// 2. Rute utama ( / ) untuk menampilkan index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inisialisasi klien Groq menggunakan Environment Variable (GROQ_API_KEY)
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// 3. Endpoint Backend untuk Chat AI Groq
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        // Panggilan ke API Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.3-70b-versatile", // Anda dapat menyesuaikan model Groq yang digunakan
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "Tidak ada respons dari AI.";
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error("Error pada server:", error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server backend.' });
    }
});

// Ekspor modul app untuk Vercel Serverless Function
module.exports = app;

// Jalankan server lokal jika dijalankan secara manual (node server.js)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}