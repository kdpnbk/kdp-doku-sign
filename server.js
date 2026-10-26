const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint untuk menangani request ke Groq API
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GROQ_API_KEY belum dikonfigurasi di environment variables." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // Sesuaikan model Groq Anda jika berbeda
        messages: [
          {
            role: "system",
            content: systemInstruction || "Anda adalah asisten AI untuk aplikasi KDP Doku Sign."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "Gagal dari server Groq" });
    }

    const aiReply = data.choices[0].message.content;

    res.json({
      candidates: [
        {
          content: {
            parts: [
              { text: aiReply }
            ]
          }
        }
      ]
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Gagal terhubung ke server: " + error.message });
  }
});

// Jalankan server secara lokal jika tidak di lingkungan produksi Vercel
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server proxy Groq aktif di http://localhost:${PORT}`);
  });
}

// Ekspor aplikasi agar kompatibel dengan Serverless Vercel
module.exports = app;