import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
  const { setToken } = useContext(AppContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  async function handleLogin(e) {
    e.preventDefault();

    const formattedData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.passwordConfirm, // Adjusted key name
    };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      setErrors(data.errors || { general: "Something went wrong!" });
    } else {
      localStorage.setItem("token", data.token);
      setToken(data.token);
      navigate("/");
      setErrors({}); // Clear errors on success
    }
  }

  return (
    <>
      <h1 className="title">Login to your Account</h1>

      <form className="w-1/2 m-auto space-y-6" onSubmit={handleLogin}>
        {/* Email Field */}
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        {/* Submit Button */}
        <button className="primary-btn" type="submit">
          Login
        </button>
      </form>
    </>
  );
}
