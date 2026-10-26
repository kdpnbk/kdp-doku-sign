const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();

// Middleware untuk memparsing JSON
app.use(express.json());

// Menyajikan file statis frontend (HTML, CSS, JS, gambar) dari folder utama
app.use(express.static(path.join(__dirname)));

// Rute utama untuk melayani index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inisialisasi Groq SDK menggunakan Environment Variable
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Endpoint untuk fitur Chat AI Groq
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || "Tidak ada respons dari AI.";
        res.json({ reply: aiResponse });

    } catch (error) {
        console.error("Error pada server:", error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server backend.' });
    }
});

// Ekspor untuk Vercel Serverless
module.exports = app;

// Jalankan lokal jika diperlukan
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}