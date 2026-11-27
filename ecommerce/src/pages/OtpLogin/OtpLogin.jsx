
import { useState } from "react";
import { sendOtp, verifyOtp } from "../../api/authApi";
import { Link } from "react-router-dom";
import "./OtpLogin.css";

function OtpLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtpHandler = async () => {
    await sendOtp(email);
    alert("OTP Sent Successfully");
  };

  const verify = async () => {
    try {
      await verifyOtp(email, otp);
      alert("OTP Verified Successfully");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="otp-page">

      {/* Left Section */}

      <div className="otp-banner">

        <div className="overlay">

          <h1>ShopEase</h1>

          <h2>OTP Login</h2>

          <p>
            Fast, Secure and Password-Free Login
          </p>

          <img
            src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
            alt="shopping"
          />

          <div className="features">
            <p>🔒 Secure Authentication</p>
            <p>⚡ Instant OTP Delivery</p>
            <p>🛍️ Safe Shopping Experience</p>
          </div>

        </div>

      </div>

      {/* Right Section */}

      <div className="otp-card">

        <h2>Welcome Back 👋</h2>

        <p className="subtitle">
          Login using OTP Verification
        </p>

        <input
          type="email"
          placeholder="Enter Email Address"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <button
          className="send-btn"
          onClick={sendOtpHandler}
        >
          Send OTP
        </button>

        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value)
          }
        />

        <button
          className="verify-btn"
          onClick={verify}
        >
          Verify OTP
        </button>

        <div className="secure-box">
          🔐 Your data is encrypted & secure
        </div>

        <Link
          to="/login"
          className="back-link"
        >
          ← Back to Login
        </Link>

      </div>

    </div>
  );
}

export default OtpLogin;


/*import { useState } from "react";
import {sendOtp,verifyOtp} from "../../api/authApi";

function OtpLogin() {

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const sendOtpHandler = async () => {
    await sendOtp(email);
    alert("OTP Sent");
  };

  const verify = async () => {

    try {

    await verifyOtp(email, otp);

    alert("OTP Verified");

  } catch (err) {

    alert("Invalid OTP");

  }
};
  /*  const response =
      await verifyLoginOtp({
        email,
        otp
      });

    localStorage.setItem(
      "token",
      response.data.token
    );
  }; */

 /* return (
    <div>

      <h2>OTP Login</h2>

      <input
        placeholder="Email"
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />

      <button onClick={sendOtpHandler}>
        Send OTP
      </button>

      <input
        placeholder="OTP"
        onChange={(e) =>
          setOtp(e.target.value)
        }
      />

      <button onClick={verify}>
        Verify OTP
      </button>

    </div>
  );
}

export default OtpLogin; */