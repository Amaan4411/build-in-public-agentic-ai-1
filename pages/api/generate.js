import fs from "fs";
import path from "path";
import axios from "axios";

export default async function handler(req, res) {
  const postsPath = path.join(process.cwd(), "data", "posts.json");
  const today = new Date().toISOString().slice(0, 10);
  const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  let posts = [];
  if (fs.existsSync(postsPath)) {
    const raw = fs.readFileSync(postsPath, "utf-8");
    try {
      posts = raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to parse posts.json:", e);
      posts = [];
    }
  }

  const existing = posts.find((p) => p.date === today);
  if (existing) return res.status(200).json(existing);

  const prompt = `Day ${posts.length + 1}: Write a short, punchy build-in-public update for an AI fitness app. Include emojis and hashtags for Twitter/LinkedIn/Threads.`;

  try {
    const hfRes = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generated = hfRes.data?.[0]?.generated_text?.trim();

    if (!generated) {
      console.warn("No text returned from HuggingFace API.");
      return res.status(500).json({ error: "Empty response from HuggingFace API." });
    }

    const newPost = {
      day: posts.length + 1,
      date: today,
      time: currentTime,
      text: generated,
    };

    posts.push(newPost);
    fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

    return res.status(200).json(newPost);
  } catch (err) {
    console.error("HuggingFace Error:", err?.response?.data || err.message || err);
    return res.status(500).json({ error: "Failed to generate post." });
  }
}