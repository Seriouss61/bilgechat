const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("OpenRouter API hatası:", data.error);
      return res.json({ reply: `OpenRouter API hatası: ${data.error.message}` });
    }

    const reply = data.choices?.[0]?.message?.content || "Cevap alınamadı.";
    res.json({ reply });
  } catch (err) {
    console.error("Sunucu hatası:", err);
    res.status(500).json({ reply: "Sunucu hatası oluştu." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Bilge sunucusu ${PORT} portunda çalışıyor.`);
});
