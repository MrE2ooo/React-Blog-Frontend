import { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Show() {
    const { id } = useParams();
    const { user, token } = useContext(AppContext);
    const navigate = useNavigate(); // Navigation hook

    const [post, setPost] = useState(null);

    async function getPost() {
        try {
            const res = await fetch(`/api/posts/${id}`);
            const data = await res.json();

            if (res.ok) {
                setPost(data.post);
            } else {
                console.error("Error fetching post:", data.message);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    useEffect(() => {
        getPost();
    }, );

    async function handleDelete(event) {
        event.preventDefault();

        if (!user || user.id !== post?.user_id) {
            console.error("Unauthorized action.");
            return;
        }

        try {
            const res = await fetch(`/api/posts/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                console.log("Post deleted successfully.");
                navigate("/"); // Navigate to home after deletion
            } else {
                const data = await res.json();
                console.error("Error deleting post:", data.message);
            }
        } catch (error) {
            console.error("Delete request error:", error);
        }
    }

    return (
        <>
            {post ? (
                <div className="mt-4 p-4 border rounded-md border-slate-400">
                    <div className="mb-2 flex items-start justify-between">
                        <div>
                            <h2 className="font-bold text-2xl">{post.title}</h2>
                            <small className="text-xs text-slate-600">
                                Created by {post.user?.name} on{" "}
                                {new Date(post.created_at).toLocaleDateString()}
                            </small>
                        </div>
                    </div>
                    <p className="mt-2 text-lg">{post.body}</p>
                    <div className="flex items-center justify-end gap-4">
                        {user?.id === post.user?.id && (
                            <>
                                <Link
                                    to={`/posts/update/${post.id}`}
                                    className="bg-green-500 text-white text-sm rounded-xl px-3 py-1"
                                >
                                    Update
                                </Link>

                                <form onSubmit={handleDelete}>
                                    <button className="bg-red-500 text-white text-sm rounded-xl px-3 py-1">
                                        Delete
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <p className="title">Post not found!</p>
            )}
        </>
    );
}