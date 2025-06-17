import { useEffect, useState } from "react";

export default function Home() {
  const [todayPost, setTodayPost] = useState(null);
  const [error, setError] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    fetch("/api/generate")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTodayPost(data);
        }
      })
      .catch(() => setError("Couldn't fetch today's post."));

    // Load recent posts
    fetch("/data/posts.json")
      .then((res) => res.json())
      .then((data) => setRecentPosts(data.reverse().slice(1, 6))) // show last 5 excluding today
      .catch(() => setRecentPosts([]));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 800, margin: "auto" }}>
      <h1 style={{ fontSize: "2rem" }}>🚀 Build In Public Tracker</h1>

      {error ? (
        <p style={{ color: "red" }}>❌ Could not generate today's post.</p>
      ) : todayPost ? (
        <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
          <strong>Day {todayPost.day} — {todayPost.date}</strong>
          <p><strong>🕒 Scheduled Time:</strong> {todayPost.time}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{todayPost.text}</p>
        </div>
      ) : (
        <p>Loading today's post...</p>
      )}

      <h2 style={{ marginTop: "2rem" }}>🕓 Recent Posts</h2>
      {recentPosts.length === 0 ? (
        <p>No recent posts found.</p>
      ) : (
        recentPosts.map((post, i) => (
          <div key={i} style={{ marginBottom: "1rem", padding: "1rem", borderBottom: "1px solid #eee" }}>
            <strong>Day {post.day} — {post.date}</strong>
            <p>{post.text.slice(0, 200)}...</p>
          </div>
        ))
      )}
    </div>
  );
}