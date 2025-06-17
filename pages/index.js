import { useEffect, useState } from "react";

export default function Home() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    fetch("/api/generate")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setPost(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetch("/data/posts.json")
      .then((res) => res.json())
      .then(setAllPosts)
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#f9fafb] text-[#111] font-sans px-6 py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        🚀 Build In Public Tracker
      </h1>

      <section className="bg-white shadow-md rounded-md p-5 mb-6">
        <h2 className="text-xl font-semibold mb-1">📅 {post ? `Day ${post.day}` : "Today's Update"}</h2>
        <p className="text-gray-500 mb-2">🕒 {post?.time || "Scheduled..."}</p>
        {loading ? (
          <p className="text-gray-400 italic animate-pulse">Loading today’s post...</p>
        ) : post?.text ? (
          <p className="text-lg leading-relaxed">{post.text}</p>
        ) : (
          <p className="text-red-500">❌ Could not generate today’s post.</p>
        )}
      </section>

      <h3 className="text-lg font-medium mb-2">🕰️ Recent Posts</h3>
      <ul className="space-y-2">
        {allPosts
          .slice()
          .reverse()
          .map((p, i) => (
            <li key={i} className="bg-white shadow-sm rounded-md p-3">
              <div className="text-sm text-gray-400">
                Day {p.day} • {p.date} • {p.time}
              </div>
              <div className="mt-1">{p.text.slice(0, 140)}...</div>
            </li>
          ))}
      </ul>
    </main>
  );
}