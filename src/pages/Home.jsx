import { useEffect, useState } from "react";
import { AppContext } from "../Context/AppContext";
import { Link } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);

  async function getPosts() {
    const res = await fetch("/api/posts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
  }

  useEffect(() => {
    getPosts();
  }, []); // Fixed dependency array

  return (
    <>
      <h1 className="title">Latest Posts</h1>

      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="mb-4 p-4 border rounded-md border-slate-400 "
          >
            <div className="mb-2 flex items-start justify-between ">
              <div>
                <h2 className="font-bold text-2xl">{post.title}</h2>
                <small className="text-xs text-slate-600 ">
                  Created by {post.user?.name} on{" "}
                  {new Date(post.created_at).toLocaleDateString()}
                </small>
              </div>
              <Link to={`/posts/${post.id}`} className="bg-blue-500 text-white text-sm rounded-lg px-3 py-1">
                Read more
              </Link>
            </div>
          </div>
        ))
      ) : (
        <p className="title">There are no posts</p>
      )}
    </>
  );
}
