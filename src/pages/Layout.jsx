import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Context/AppContext";

export default function Layout() {
  const { user, token, setUser, setToken } = useContext(AppContext); // Use Context
  const navigate = useNavigate();

  async function handleLogout(e) {
    e.preventDefault(); // Prevent default behavior

    try {
      // Send logout request to the backend
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Pass user's token
        },
      });

      if (!res.ok) {
        console.error("Logout failed");
        return; // Exit if logout failed
      }

      // Clear token and user data on successful logout
      const data = await res.json();
      console.log(data); // Log success response from backend
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }

  return (
    <>
      <header>
        <nav>
          <Link to="/" className="nav-link">
            Home
          </Link>
          {user ? (
            <div className=" flex items-center space-x-4">
              <p className="text-slate-400 text-xs">Welcome back {user.name}</p>
              <Link to="/create" className="nav-link">
                New Post
              </Link>
              <form onSubmit={handleLogout}>
                <button className="nav-link ">Logout</button>
              </form>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </div>
          )}
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}