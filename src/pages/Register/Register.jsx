import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../Login/Login.css";

const googleIconSvg = (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: "10px", flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

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

  const { register, loginWithGoogle } = useAuth();
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

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setSubmitting(true);
      const data = await register(formData);
      if (data?.user?.identities?.length === 0) {
        setError("This email is already registered. Please sign in instead.");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Registration submit error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Google sign-up failed.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: "480px" }}>
        <h2 className="auth-title">Create VIP Account</h2>

        {error && <div className="auth-error">{error}</div>}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleSignup}
          id="google-signup-btn"
          className="oauth-btn"
        >
          {googleIconSvg}
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or register with email</span>
          <div className="auth-divider-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row-2" style={{ marginBottom: "15px" }}>
            <div className="auth-input-group" style={{ marginBottom: 0 }}>
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            <div className="auth-input-group" style={{ marginBottom: 0 }}>
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <div className="auth-input-group" style={{ marginBottom: "25px" }}>
            <label>Confirm Password</label>
            <input
              type="password"
              name="password_confirm"
              required
              value={formData.password_confirm}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            id="email-register-btn"
            className="auth-submit-btn"
          >
            {submitting ? "Creating Account..." : "Register Now"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "#D4AF37", textDecoration: "none", fontWeight: "bold" }}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
