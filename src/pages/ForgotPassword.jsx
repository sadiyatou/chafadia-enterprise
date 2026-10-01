import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/images/home-page1.png";

function ForgotPassword() {
  const { users } = useAuth();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRecover = (e) => {
    e.preventDefault();

    const user = users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase()
    );

    if (!user) {
      setMessage("No account found with this email.");
      return;
    }

  setMessage("Account found. Please contact admin to reset your password.");
  };

  return (
    <div
      className="auth-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(0, 31, 77, 0.42),
            rgba(0, 31, 77, 0.42)
          ),
          url(${heroImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="auth-card">
        <h1 className="logo-text">
          CHAFADIA <span className="gold">ENTERPRISE</span>
        </h1>

        <p className="welcome-text">
          Enter your email address to recover your account.
        </p>

        <form onSubmit={handleRecover}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn" type="submit">
            Recover Account
          </button>
        </form>

        {message && <p className="message">{message}</p>}

        <p>
          <Link to="/login">Back to Login</Link>
        </p>

        <div className="login-footer">
          <small>
            Secure Recovery • Protected Access • Chafadia Enterprise
          </small>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;