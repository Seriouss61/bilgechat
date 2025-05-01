const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); // HTML dosyasını buraya koymalısın

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "Mesaj alınamadı." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenAI API hatası:", data.error);
      return res.status(500).json({ reply: "OpenAI API hatası oluştu: " + data.error.message });
    }

    const reply = data.choices?.[0]?.message?.content || "Cevap alınamadı.";
    res.json({ reply });

  } catch (error) {
    console.error("Sunucu hatası:", error);
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
});

app.listen(PORT, () => {
  console.log(`Bilge sunucusu ${PORT} portunda çalışıyor.`);
});
