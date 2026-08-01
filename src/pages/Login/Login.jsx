import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/profile";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setSubmitting(true);
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: "420px", margin: "60px auto", padding: "30px", background: "#111", borderRadius: "12px", border: "1px solid #D4AF37", color: "#fff" }}>
        <h2 style={{ textAlign: "center", color: "#D4AF37", marginBottom: "25px" }}>Welcome Back</h2>

        {error && (
          <div style={{ background: "rgba(255,0,0,0.2)", border: "1px solid red", color: "#ff6b6b", padding: "10px", borderRadius: "4px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              style={{ width: "100%", padding: "12px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "6px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px" }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "6px", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "25px", fontSize: "14px" }}>
            <Link to="/forgot-password" style={{ color: "#D4AF37", textDecoration: "none" }}>Forgot Password?</Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{ width: "100%", padding: "14px", background: "#D4AF37", color: "#000", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa" }}>
          Don't have an account? <Link to="/register" style={{ color: "#D4AF37", textDecoration: "none" }}>Register</Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default Login;
