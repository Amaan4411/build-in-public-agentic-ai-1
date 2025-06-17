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
    posts = raw ? JSON.parse(raw) : [];
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
        },
      }
    );

    const generated = hfRes.data?.[0]?.generated_text || "Couldn't generate post.";

    const newPost = {
      day: posts.length + 1,
      date: today,
      time: currentTime,
      text: generated,
    };

    posts.push(newPost);

    // ✅ Only write to disk if running locally
    if (process.env.VERCEL !== "1") {
      fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
    }

    return res.status(200).json(newPost);
  } catch (err) {
    console.error("HuggingFace Error:", err.message || err);
    return res.status(500).json({ error: "Failed to generate post." });
  }
}