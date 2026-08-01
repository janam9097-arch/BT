import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    first_name: "",
    last_name: "",
    password: "",
    password_confirm: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setSubmitting(true);
      await register(formData);
      navigate("/profile");
    } catch (err) {
      const errRes = err.response?.data;
      if (errRes && typeof errRes === "object") {
        const msg = Object.entries(errRes)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
        setError(msg);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "50px auto", padding: "30px", background: "#111", borderRadius: "12px", border: "1px solid #D4AF37", color: "#fff" }}>
        <h2 style={{ textAlign: "center", color: "#D4AF37", marginBottom: "25px" }}>Create VIP Account</h2>

        {error && (
          <div style={{ background: "rgba(255,0,0,0.2)", border: "1px solid red", color: "#ff6b6b", padding: "10px", borderRadius: "4px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px" }}>First Name</label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px" }}>Last Name</label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "6px" }}>Confirm Password</label>
            <input
              type="password"
              name="password_confirm"
              required
              value={formData.password_confirm}
              onChange={handleChange}
              style={{ width: "100%", padding: "10px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: "100%", padding: "14px", background: "#D4AF37", color: "#000", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
          >
            {submitting ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa" }}>
          Already have an account? <Link to="/login" style={{ color: "#D4AF37", textDecoration: "none" }}>Sign In</Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Register;
