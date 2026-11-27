import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";
import "./VerifyOtp.css";

function VerifyOtp() {

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  const submitOtp = async () => {
    try {

      await verifyOtp(email, otp);

      alert("OTP Verified Successfully");

      navigate("/login");

    } catch (err) {

      console.error(err);
      alert("Invalid OTP");

    }
  };

  if (!email) {
    return (
      <div className="error-box">
        Email not found. Please signup again.
      </div>
    );
  }

  return (
    <div className="verify-page">

      {/* Left Side */}

      <div className="verify-banner">

        <div className="banner-overlay">

          <h1>ShopEase</h1>

          <h2>Account Verification</h2>

          <p>
            Enter the OTP sent to your registered email
            and activate your account securely.
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            alt="otp verification"
          />

          <div className="verify-features">
            <p>🔐 Secure Verification</p>
            <p>⚡ Instant Activation</p>
            <p>🛡️ Protected Account Access</p>
          </div>

        </div>

      </div>

      {/* Right Side */}

      <div className="verify-card">

        <div className="otp-icon">
          📧
        </div>

        <h2>Verify OTP</h2>

        <p className="subtitle">
          Enter the verification code sent to
          <br />
          <strong>{email}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter 6 Digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          className="verify-btn"
          onClick={submitOtp}
        >
          Verify Account
        </button>

        <div className="security-note">
          🔒 Your information is encrypted and secure
        </div>

        <Link
          to="/login"
          className="back-link"
        >
          ← Back to Login
        </Link>
        
         <Link
          to="/"
          className="back-link"
        >
          ← Back to Home
        </Link>


      </div>

    </div>
  );
}

export default VerifyOtp;


/*import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/authApi";

function VerifyOtp() {

const location = useLocation();
const navigate = useNavigate();

const email = location.state?.email;

const [otp, setOtp] = useState("");

const submitOtp = async () => {
try {


  await verifyOtp(email, otp);

  alert("OTP Verified Successfully");

  navigate("/login");

} catch (err) {

  console.error(err);
  alert("Invalid OTP");

}


};

if (!email) {
return <h2>Email not found. Please signup again.</h2>;
}

return (
<> <h2>Verify OTP</h2>


  <input
    type="text"
    placeholder="Enter OTP"
    value={otp}
    onChange={(e) => setOtp(e.target.value)}
  />

  <button onClick={submitOtp}>
    Verify
  </button>
</>


);
}

export default VerifyOtp; */
