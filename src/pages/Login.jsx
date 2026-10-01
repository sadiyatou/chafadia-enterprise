import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";
import heroImage from "../assets/images/home-page3.png";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();

    const user = login(form.email, form.password);

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "cashier") {
      navigate("/cashier");
    } else {
      navigate("/customer");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const user = {
        id: googleUser.uid,
        name: googleUser.displayName || "Google User",
        email: googleUser.email,
        photo: googleUser.photoURL,
        role: "customer",
      };

      localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
      );

      navigate("/customer");
    } catch (error) {
      console.error(error);
      alert("Google login failed. Please try again.");
    }
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
          Welcome back. Sign in to access your account.
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          <div className="password-box">
            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter your password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
              aria-label="Show or hide password"
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </button>
          </div>

          <button
            className="btn"
            type="submit"
          >
            Login
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p>
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </p>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">
            Create Account
          </Link>
        </p>

        <div className="login-footer">
          <small>
            Secure Login • Protected Access •
            Chafadia Enterprise
          </small>
        </div>
      </div>
    </div>
  );
}

export default Login;