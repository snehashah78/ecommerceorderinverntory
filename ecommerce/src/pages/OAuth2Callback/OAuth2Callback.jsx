import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

/**
 * OAuth2Callback — /oauth2/callback
 *
 * After Google login, the backend redirects to:
 *   http://localhost:3000/oauth2/callback?token=JWT&role=viewer
 *
 * This page reads those params, stores them via AuthContext,
 * and navigates to the dashboard.
 *
 * If there is an error param instead, it shows the error.
 */
function OAuth2Callback() {
  const navigate       = useNavigate();
  const { login }      = useAuth();
  const [status, setStatus] = useState("processing"); // processing | error
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get("token");
    const role   = params.get("role") || "viewer";
    const error  = params.get("error");

    if (error) {
      setErrMsg(decodeURIComponent(error));
      setStatus("error");
      return;
    }

    if (!token) {
      setErrMsg("No token received from Google. Please try again.");
      setStatus("error");
      return;
    }

    // Store token + role via AuthContext (same as normal login)
    login(token, role);

    // Short delay so the user sees the success animation, then redirect
    const timer = setTimeout(() => navigate("/dashboard", { replace: true }), 1200);
    return () => clearTimeout(timer);
  }, [login, navigate]);

  return (
    <div className="oauth-callback-page">
      <div className="oauth-card">
        {status === "processing" ? (
          <>
            <div className="oauth-spinner"></div>
            <h2>Signing you in with Google…</h2>
            <p>Please wait, this only takes a moment.</p>
          </>
        ) : (
          <>
            <div className="oauth-error-icon">⚠️</div>
            <h2>Google Sign-In Failed</h2>
            <p>{errMsg}</p>
            <button onClick={() => navigate("/login")}>
              ← Back to Login
            </button>
          </>
        )}
      </div>

      <style>{`
        .oauth-callback-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff7ed, #fef3c7);
          font-family: 'Inter', sans-serif;
        }
        .oauth-card {
          background: white;
          border-radius: 24px;
          padding: 52px 44px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
          max-width: 420px;
          width: 100%;
          border-top: 5px solid;
          border-image: linear-gradient(90deg,#f97316,#e11d48) 1;
          border-radius: 24px;
          animation: cardIn 0.4s cubic-bezier(0.34,1.3,0.64,1) both;
        }
        @keyframes cardIn {
          from { opacity:0; transform:scale(0.9) translateY(20px); }
          to   { opacity:1; transform:scale(1)   translateY(0); }
        }
        .oauth-spinner {
          width: 52px;
          height: 52px;
          border: 5px solid #fde8d0;
          border-top-color: #f97316;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 24px;
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        .oauth-card h2 {
          font-size: 22px;
          font-weight: 800;
          color: #1c0a00;
          margin-bottom: 10px;
        }
        .oauth-card p {
          font-size: 15px;
          color: #6b7280;
          line-height: 1.6;
        }
        .oauth-error-icon { font-size: 52px; margin-bottom: 16px; }
        .oauth-card button {
          margin-top: 24px;
          padding: 12px 28px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg,#f97316,#e11d48);
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .oauth-card button:hover { transform:translateY(-2px); }
      `}</style>
    </div>
  );
}

export default OAuth2Callback;
