import React, { useEffect, useState } from "react";

export default function Home() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/generate")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch(() => {
        setPost(null);
        setLoading(false);
      });
  }, []);

  return (
    <main
      style={{
        fontFamily: "Segoe UI, sans-serif",
        padding: "2rem 3rem",
        maxWidth: "768px",
        margin: "auto",
        background: "#fff",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "1rem" }}>
        🚀 <span style={{ fontWeight: "600" }}>Build In Public Tracker</span>
      </h1>

      {loading ? (
        <p style={{ fontSize: "1.1rem", color: "#777" }}>Loading today's post...</p>
      ) : post ? (
        <>
          <div
            style={{
              padding: "1rem",
              borderRadius: "8px",
              background: "#f4f4f4",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              marginBottom: "1rem",
            }}
          >
            <h3>📅 Day {post.day} — {post.date}</h3>
            <p><strong>🕒 Scheduled Time:</strong> {post.time}</p>
            <p style={{ marginTop: "1rem", lineHeight: 1.6 }}>{post.text}</p>
          </div>
        </>
      ) : (
        <p style={{ color: "red" }}>❌ Could not generate today's post.</p>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h2 style={{ fontSize: "1.3rem", marginBottom: "0.5rem" }}>🕓 Recent Posts</h2>
      <ul style={{ paddingLeft: "1rem", color: "#444" }}>
        {post && (
          <li>
            <strong>Day {post.day}:</strong> {post.text.slice(0, 60)}...
          </li>
        )}
      </ul>
    </main>
  );
}