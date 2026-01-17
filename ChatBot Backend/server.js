// server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch"; // npm install node-fetch
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("../public")); // serve frontend files

// Test route
app.get("/", (req, res) => {
  res.send("Backend running!");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "⚠️ Message cannot be empty" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [
          { role: "system", content: "You are LiveFit AI, a friendly nutrition assistant." },
          { role: "user", content: userMessage }
        ]
      })
    });

    // Log raw response for debugging
    const responseText = await response.text();
    console.log("Raw response from OpenRouter/Deepseek:", responseText);

    // Try parsing JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (err) {
      console.error("Failed to parse JSON:", err);
      return res.status(500).json({ reply: "⚠️ AI service returned invalid JSON" });
    }

    // Extract bot reply safely
    const botReply = data?.choices?.[0]?.message?.content || "⚠️ AI did not return a reply";

    res.json({ reply: botReply });

  } catch (err) {
    console.error("Deepseek API fetch error:", err);
    res.status(500).json({ reply: "⚠️ AI service error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
