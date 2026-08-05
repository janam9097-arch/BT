import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const googleIconSvg = (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: "10px", flexShrink: 0 }}>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
  </svg>
);

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, loginWithGoogle } = useAuth();
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
      setError(
        err.message || "Invalid email or password."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>

        {error && <div className="auth-error">{error}</div>}

        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          id="google-signin-btn"
          className="oauth-btn"
        >
          {googleIconSvg}
          Continue with Google
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">or sign in with email</span>
          <div className="auth-divider-line" />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="auth-input"
            />
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input"
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "25px",
              fontSize: "14px",
            }}
          >
            <Link
              to="/forgot-password"
              style={{ color: "#D4AF37", textDecoration: "none" }}
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={submitting}
            id="email-signin-btn"
            className="auth-submit-btn"
          >
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa", fontSize: "14px" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{ color: "#D4AF37", textDecoration: "none", fontWeight: "bold" }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
