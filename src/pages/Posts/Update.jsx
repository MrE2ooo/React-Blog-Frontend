import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

export default function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useContext(AppContext);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });

  const [errors, setErrors] = useState({
    title: null,
    body: null,
  });

  const [generalError, setGeneralError] = useState(null);

  async function getPost() {
    const res = await fetch(`/api/posts/${id}`);
    const data = await res.json();

    if (res.ok) {
      if (data.post.user_id !== user.id) {
        navigate("/");
      }

      setFormData({
        title: data.post.title,
        body: data.post.body,
      });
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API Error:", data.errors || "Something went wrong.");

        // Handle field-specific errors
        setErrors(data.errors || {});
        setGeneralError(data.message || "Failed to create the post.");
        return;
      }

      // On success, reset form and navigate to home
      console.log("Post Created Successfully:", data);
      setFormData({ title: "", body: "" });
      setErrors({ title: null, body: null });
      setGeneralError(null);
      navigate("/");
    } catch (err) {
      console.error("Request Error:", err);
      setGeneralError("An unexpected error occurred.");
    }
  }

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <h1 className="title">Update your Post</h1>

      {generalError && <p className="error">{generalError}</p>}

      <form className="w-1/2 mx-auto space-y-6" onSubmit={handleUpdate}>
        <div>
          <input
            type="text"
            placeholder="Post Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
          {errors.title && <p className="error">{errors.title}</p>}
        </div>

        <div>
          <textarea
            rows={6}
            placeholder="Post Content"
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            required
          />
          {errors.body && <p className="error">{errors.body}</p>}
        </div>

        <button className="primary-btn" type="submit">
          Update
        </button>
      </form>
    </>
  );
}
