import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  const parseErrorResponse = (err) => {
    if (!err.response || err.code === "ERR_NETWORK") {
      return "Unable to connect to the authentication server. Please try again later.";
    }

    const resData = err.response.data;
    if (!resData) {
      return "Unable to connect to the authentication server. Please try again later.";
    }

    if (typeof resData === "string") {
      return "Unable to connect to the authentication server. Please try again later.";
    }

    if (typeof resData === "object") {
      if (resData.detail) return resData.detail;
      if (resData.message) return resData.message;

      const messages = [];
      for (const [key, val] of Object.entries(resData)) {
        const valText = Array.isArray(val) ? val.join(" ") : String(val);
        const lowerVal = valText.toLowerCase();
        
        if (lowerVal.includes("email address already exists") || lowerVal.includes("email already exists")) {
          messages.push("Email already exists.");
        } else if (lowerVal.includes("username already exists")) {
          messages.push("Username already exists.");
        } else if (lowerVal.includes("too short") || lowerVal.includes("too common") || lowerVal.includes("entirely numeric") || lowerVal.includes("weak")) {
          messages.push("Password is too weak.");
        } else {
          const fieldName = key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
          messages.push(`${fieldName}: ${valText}`);
        }
      }
      return messages.join(" | ") || "Registration failed. Please check your entries.";
    }

    return "Unable to connect to the authentication server. Please try again later.";
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
      navigate("/");
    } catch (err) {
      console.error("Registration submit error:", err);
      const parsedMsg = parseErrorResponse(err);
      setError(parsedMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "480px", margin: "50px auto", padding: "30px", background: "#111", borderRadius: "12px", border: "1px solid #D4AF37", color: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#D4AF37", marginBottom: "25px" }}>Create VIP Account</h2>

      {error && (
        <div style={{ background: "rgba(255,0,0,0.15)", border: "1px solid #ff4d4d", color: "#ff6b6b", padding: "12px", borderRadius: "6px", marginBottom: "20px", fontSize: "14px", lineHeight: "1.4" }}>
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
  );
}

export default Register;
