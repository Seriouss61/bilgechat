const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));  // "public" klasöründe frontend dosyanız varsa.

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Mesaj boş olamaz." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API hatası:", errorText);
      return res.status(500).json({ reply: "OpenAI API hatası oluştu." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Cevap alınamadı.";
    res.json({ reply });

  } catch (err) {
    console.error("Sunucu hatası:", err);
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bilge sunucusu ${PORT} portunda çalışıyor.`);
});
