import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * AuthCallback handles the OAuth redirect from Google/Supabase.
 * When Supabase redirects back after Google login, the tokens are in the URL hash.
 * The Supabase client (with detectSessionInUrl: true) automatically picks them up.
 * This page shows a loading state while that happens, then redirects to profile.
 */
function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    // Give Supabase client time to process the URL hash tokens
    // The onAuthStateChange listener in AuthContext will handle setting the user
    const timer = setTimeout(() => {
      // If we're still on this page after 5 seconds, something went wrong
      setError("Authentication is taking longer than expected. Redirecting...");
      navigate("/profile", { replace: true });
    }, 5000);

    // Check if hash contains access_token (success indicator)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get("access_token")) {
      // Supabase will process this automatically, redirect after a brief delay
      setTimeout(() => {
        navigate("/profile", { replace: true });
      }, 1500);
    } else if (hashParams.get("error")) {
      setError(hashParams.get("error_description") || "Authentication failed.");
    }

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        color: "#fff",
        padding: "40px",
      }}
    >
      {error ? (
        <div
          style={{
            background: "rgba(255,0,0,0.15)",
            border: "1px solid #ff4d4d",
            color: "#ff6b6b",
            padding: "20px",
            borderRadius: "8px",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      ) : (
        <>
          {/* Animated spinner */}
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "3px solid #333",
              borderTop: "3px solid #D4AF37",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              marginBottom: "20px",
            }}
          />
          <p style={{ color: "#D4AF37", fontSize: "18px", fontWeight: "600" }}>
            Completing sign in...
          </p>
          <p style={{ color: "#888", fontSize: "14px", marginTop: "8px" }}>
            Please wait while we verify your account.
          </p>
        </>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default AuthCallback;
