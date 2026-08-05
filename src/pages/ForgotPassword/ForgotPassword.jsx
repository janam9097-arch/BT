import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      setSubmitting(true);
      const res = await authService.forgotPassword(email);
      setMessage(res.message || "Password reset instructions have been sent to your email.");
      setIsError(false);
    } catch (err) {
      setMessage(err.message || "Error processing request. Please try again.");
      setIsError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "420px", margin: "60px auto", padding: "30px", background: "#111", borderRadius: "12px", border: "1px solid #D4AF37", color: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#D4AF37", marginBottom: "15px" }}>Reset Password</h2>
      <p style={{ color: "#aaa", fontSize: "14px", textAlign: "center", marginBottom: "25px" }}>
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      {message && (
        <div style={{
          background: isError ? "rgba(255,0,0,0.15)" : "rgba(212,175,55,0.2)",
          border: `1px solid ${isError ? "#ff4d4d" : "#D4AF37"}`,
          color: isError ? "#ff6b6b" : "#D4AF37",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "20px"
        }}>
          {message}
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
            placeholder="your-email@example.com"
            style={{ width: "100%", padding: "12px", background: "#222", color: "#fff", border: "1px solid #444", borderRadius: "6px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{ width: "100%", padding: "14px", background: "#D4AF37", color: "#000", border: "none", borderRadius: "6px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
        >
          {submitting ? "Sending..." : "Send Instructions"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa" }}>
        Remember your password? <Link to="/login" style={{ color: "#D4AF37", textDecoration: "none" }}>Sign In</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
