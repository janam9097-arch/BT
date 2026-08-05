import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const googleIconSvg = (
  <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: "10px" }}>
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
      // Supabase may require email confirmation — check
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
      // Redirect handled by Supabase OAuth
    } catch (err) {
      setError(err.message || "Google sign-up failed.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "50px auto",
        padding: "30px",
        background: "#111",
        borderRadius: "12px",
        border: "1px solid #D4AF37",
        color: "#fff",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#D4AF37",
          marginBottom: "25px",
        }}
      >
        Create VIP Account
      </h2>

      {error && (
        <div
          style={{
            background: "rgba(255,0,0,0.15)",
            border: "1px solid #ff4d4d",
            color: "#ff6b6b",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "14px",
            lineHeight: "1.4",
          }}
        >
          {error}
        </div>
      )}

      {/* Google OAuth Button */}
      <button
        onClick={handleGoogleSignup}
        id="google-signup-btn"
        style={{
          width: "100%",
          padding: "13px",
          background: "#fff",
          color: "#333",
          border: "none",
          borderRadius: "6px",
          fontWeight: "600",
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          marginBottom: "20px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f5f5f5";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.3)";
        }}
      >
        {googleIconSvg}
        Sign up with Google
      </button>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0",
          gap: "12px",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "#333" }} />
        <span style={{ color: "#666", fontSize: "13px", whiteSpace: "nowrap" }}>
          or register with email
        </span>
        <div style={{ flex: 1, height: "1px", background: "#333" }} />
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "6px" }}>
              First Name
            </label>
            <input
              type="text"
              name="first_name"
              required
              value={formData.first_name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "6px" }}>
              Last Name
            </label>
            <input
              type="text"
              name="last_name"
              required
              value={formData.last_name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "10px",
                background: "#222",
                color: "#fff",
                border: "1px solid #444",
                borderRadius: "4px",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Username
          </label>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "25px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="password_confirm"
            required
            value={formData.password_confirm}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          id="email-register-btn"
          style={{
            width: "100%",
            padding: "14px",
            background: "#D4AF37",
            color: "#000",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: "pointer",
            transition: "opacity 0.2s ease",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Creating Account..." : "Register Now"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa" }}>
        Already have an account?{" "}
        <Link
          to="/login"
          style={{ color: "#D4AF37", textDecoration: "none" }}
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}

export default Register;
