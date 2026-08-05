import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import "../Login/Login.css";

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
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p style={{ color: "#aaa", fontSize: "14px", textAlign: "center", marginBottom: "25px" }}>
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {message && (
          <div className={isError ? "auth-error" : "auth-error"} style={{
            background: isError ? "rgba(255,0,0,0.15)" : "rgba(212,175,55,0.2)",
            borderColor: isError ? "#ff4d4d" : "#D4AF37",
            color: isError ? "#ff6b6b" : "#D4AF37",
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="auth-input"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="auth-submit-btn"
          >
            {submitting ? "Sending..." : "Send Instructions"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#aaa", fontSize: "14px" }}>
          Remember your password? <Link to="/login" style={{ color: "#D4AF37", textDecoration: "none", fontWeight: "bold" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
