import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";


export default function Register() {

  const {setToken} =useContext(AppContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({});

  async function handleRegister(e) {
    e.preventDefault();

    const formattedData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.passwordConfirm, // Adjusted key name
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    });

    const data = await res.json();
    console.log("API Response:", data);

    if (!res.ok) {
      setErrors(data.errors || { general: "Something went wrong!" });
    } else {
      localStorage.setItem('token' ,data.token);
      setToken(data.token);
      navigate('/');
      setErrors({}); // Clear errors on success
    }

    console.log("Form Submitted", formattedData);
  }

  return (
    <>

      <h1 className="title">Register a New Account</h1>
      

      <form className="w-1/2 m-auto space-y-6" onSubmit={handleRegister}>
        {/* Name Field */}
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="passwordConfirm">Confirm Password</label>
          <input
            type="password"
            id="passwordConfirm"
            name="passwordConfirm"
            placeholder="Confirm your password"
            value={formData.passwordConfirm}
            onChange={(e) =>
              setFormData({ ...formData, passwordConfirm: e.target.value })
            }
          />
          {errors.passwordConfirm && (
            <p className="error">{errors.passwordConfirm}</p>
          )}
        </div>

        {/* General Error */}
        {errors.general && <p className="error">{errors.general}</p>}

        {/* Submit Button */}
        <button className="primary-btn" type="submit">
          Register
        </button>
      </form>
    </>
  );
}
