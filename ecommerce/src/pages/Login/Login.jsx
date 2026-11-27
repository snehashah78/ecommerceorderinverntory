import { useState } from "react";
import { login } from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaShoppingBag,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import "./Login.css";

const PERKS = [
  { icon: "🚚", title: "Free Delivery", desc: "On orders above ₹499" },
  { icon: "🔐", title: "Secure Payments", desc: "Bank-level encryption" },
  { icon: "↩", title: "Easy Returns", desc: "7-day hassle-free returns" },
];

const REVIEWS = [
  { name: "Anjali M.", rating: 5, text: "Amazing deals every single day!" },
  { name: "Rohit K.", rating: 5, text: "Super fast delivery, love it." },
];

function Stars({ count }) {
  return (
    <span className="lp-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <FaStar key={i} style={{ color: i < count ? "#f59e0b" : "#374151" }} />
      ))}
    </span>
  );
}

function Login() {
  const navigate    = useNavigate();
  const { login: ctxLogin } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(form);
      const token = response.data.token;
      // Backend may return role; default to "viewer" if not provided
      const role  = response.data.role || "viewer";
      ctxLogin(token, role);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Left Panel ──────────────────────── */}
      <div className="lp-left">
        {/* Overlay */}
        <div className="lp-overlay"></div>

        <img
          className="lp-bg-img"
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200"
          alt="Shopping"
        />

        <div className="lp-left-content">
          {/* Brand */}
          <div className="lp-brand">
            <FaShoppingBag className="lp-brand-icon" />
            <span>ShopEase</span>
          </div>

          <h2>Welcome back to the best shopping experience</h2>

          <p>
            Thousands of products. Exclusive deals. Lightning-fast delivery.
            All in one place.
          </p>

          {/* Stats */}
          <div className="lp-stats">
            <div className="lp-stat">
              <h3>50K+</h3>
              <span>Customers</span>
            </div>
            <div className="lp-stat-divider"></div>
            <div className="lp-stat">
              <h3>12K+</h3>
              <span>Products</span>
            </div>
            <div className="lp-stat-divider"></div>
            <div className="lp-stat">
              <h3>4.9 ⭐</h3>
              <span>Rating</span>
            </div>
          </div>

          {/* Perks */}
          <div className="lp-perks">
            {PERKS.map((p) => (
              <div className="lp-perk" key={p.title}>
                <span className="lp-perk-icon">{p.icon}</span>
                <div>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mini reviews */}
          <div className="lp-reviews">
            {REVIEWS.map((r) => (
              <div className="lp-review" key={r.name}>
                <Stars count={r.rating} />
                <p>"{r.text}"</p>
                <span>— {r.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel / Form ───────────────── */}
      <div className="lp-right">
        <div className="login-card">
          {/* Top accent */}
          <div className="lc-accent"></div>

          <div className="lc-header">
            <div className="lc-logo">👋</div>
            <h2>Welcome Back</h2>
            <p>Sign in to continue shopping</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="lc-input-group">
              <label htmlFor="email">Email Address</label>
              <div className="lc-input-box">
                <span className="lc-icon">
                  <FaEnvelope />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                {form.email.includes("@") && (
                  <span className="lc-check">
                    <FaCheckCircle />
                  </span>
                )}
              </div>
            </div>

            {/* Password */}
            <div className="lc-input-group">
              <div className="lc-label-row">
                <label htmlFor="password">Password</label>
                <Link to="#" className="lc-forgot">Forgot password?</Link>
              </div>
              <div className="lc-input-box">
                <span className="lc-icon">
                  <FaLock />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="lc-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="lc-remember">
              <label className="lc-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="lc-checkmark"></span>
                Remember me for 30 days
              </label>
            </div>

            {/* Error */}
            {error && (
              <div className="lc-error" role="alert">
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="lc-submit-btn" disabled={loading}>
              {loading ? (
                <span className="lc-spinner"></span>
              ) : (
                "Sign In →"
              )}
            </button>

            {/* Divider */}
            <div className="lc-divider">
              <span>OR</span>
            </div>

            {/* Google */}
            <button type="button" className="lc-google-btn">
              <FaGoogle />
              Continue with Google
            </button>

            {/* OTP login */}
            <Link to="/otp-login" className="lc-otp-btn">
              📱 Login with OTP instead
            </Link>

            {/* Bottom links */}
            <div className="lc-bottom">
              <span>Don't have an account?</span>
              <Link to="/signup">Create one free →</Link>
            </div>

            <Link to="/" className="lc-back-home">
              ← Back to Home
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
