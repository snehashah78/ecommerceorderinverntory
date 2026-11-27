import { useState } from "react";
import { signup } from "../../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaCheckCircle,
} from "react-icons/fa";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      navigate("/verify", { state: { email: form.email } });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStrength = () => {
    const pwd = form.password;
    if (!pwd) return null;
    if (pwd.length < 4) return { label: "Weak", level: 1, color: "#ef4444" };
    if (pwd.length < 8) return { label: "Medium", level: 2, color: "#f59e0b" };
    return { label: "Strong", level: 3, color: "#10b981" };
  };

  const strength = getStrength();

  return (
    <div className="signup-page">
      {/* Decorative blobs */}
      <div className="sp-blob sp-blob1"></div>
      <div className="sp-blob sp-blob2"></div>

      {/* ── Left Panel ──────────────────────── */}
      <div className="left-panel">
        <div className="brand">
          <h1>ShopEase</h1>
          <span>Premium Shopping Experience</span>
        </div>

        <h2>
          Shop Smarter,
          <br />
          <span>Live Better.</span>
        </h2>

        <p>
          Join thousands of happy customers enjoying exclusive deals,
          lightning-fast delivery and secure online shopping.
        </p>

        <div className="feature-list">
          <div className="feature">
            <div className="feature-icon">
              <FaShieldAlt />
            </div>
            <div>
              <h4>100% Secure Payments</h4>
              <p>Bank-level encryption on every transaction</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <FaTruck />
            </div>
            <div>
              <h4>Fast Nationwide Delivery</h4>
              <p>Delivered to your door in 2–5 days</p>
            </div>
          </div>

          <div className="feature">
            <div className="feature-icon">
              <FaUndo />
            </div>
            <div>
              <h4>Easy 7-Day Returns</h4>
              <p>Hassle-free returns, no questions asked</p>
            </div>
          </div>
        </div>

        <div className="testimonial-snippet">
          <img src="https://i.pravatar.cc/100?img=47" alt="Customer" />
          <div>
            <p>"Best shopping experience I've ever had!"</p>
            <span>— Priya S., Verified Customer</span>
          </div>
        </div>
      </div>

      {/* ── Right Panel / Form ───────────────── */}
      <div className="signup-card">
        {/* Card top accent */}
        <div className="card-accent"></div>

        <div className="card-header">
          <div className="card-logo">🛍</div>
          <h2>Create Account</h2>
          <p>Start your shopping journey today</p>
        </div>

        {/* Progress steps */}
        <div className="steps">
          <div className="step active">
            <span>1</span>
            <p>Account</p>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <span>2</span>
            <p>Verify</p>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <span>3</span>
            <p>Shop</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-box">
              <span className="input-icon">
                <FaUser />
              </span>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
              {form.name.length > 1 && (
                <span className="input-check">
                  <FaCheckCircle />
                </span>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-box">
              <span className="input-icon">
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
                <span className="input-check">
                  <FaCheckCircle />
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-box">
              <span className="input-icon">
                <FaLock />
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Strength meter */}
            {strength && (
              <div className="strength-meter">
                <div className="strength-bars">
                  <div
                    className="strength-bar"
                    style={{
                      background:
                        strength.level >= 1 ? strength.color : "#e2e8f0",
                    }}
                  ></div>
                  <div
                    className="strength-bar"
                    style={{
                      background:
                        strength.level >= 2 ? strength.color : "#e2e8f0",
                    }}
                  ></div>
                  <div
                    className="strength-bar"
                    style={{
                      background:
                        strength.level >= 3 ? strength.color : "#e2e8f0",
                    }}
                  ></div>
                </div>
                <span style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="error-msg" role="alert">
              ⚠ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="signup-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-spinner"></span>
            ) : (
              "Create Account →"
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Google */}
          <button type="button" className="google-btn">
            <FaGoogle />
            Continue with Google
          </button>

          {/* Bottom links */}
          <div className="bottom-links">
            <Link to="/">← Back to Home</Link>
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
