import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";
import heroImage from "../assets/images/home-page4.png";

const countryCodes = [
  { flag: "🇨🇲", name: "Cameroon", code: "+237" },
  { flag: "🇳🇬", name: "Nigeria", code: "+234" },
  { flag: "🇬🇭", name: "Ghana", code: "+233" },
  { flag: "🇿🇦", name: "South Africa", code: "+27" },
  { flag: "🇰🇪", name: "Kenya", code: "+254" },
  { flag: "🇺🇬", name: "Uganda", code: "+256" },
  { flag: "🇹🇿", name: "Tanzania", code: "+255" },
  { flag: "🇪🇹", name: "Ethiopia", code: "+251" },
  { flag: "🇪🇬", name: "Egypt", code: "+20" },
  { flag: "🇲🇦", name: "Morocco", code: "+212" },
  { flag: "🇩🇿", name: "Algeria", code: "+213" },
  { flag: "🇹🇳", name: "Tunisia", code: "+216" },
  { flag: "🇸🇳", name: "Senegal", code: "+221" },
  { flag: "🇨🇮", name: "Côte d’Ivoire", code: "+225" },
  { flag: "🇬🇦", name: "Gabon", code: "+241" },
  { flag: "🇨🇬", name: "Congo", code: "+242" },
  { flag: "🇨🇩", name: "DR Congo", code: "+243" },
  { flag: "🇹🇩", name: "Chad", code: "+235" },
  { flag: "🇨🇫", name: "Central African Republic", code: "+236" },
  { flag: "🇺🇸", name: "United States", code: "+1" },
  { flag: "🇨🇦", name: "Canada", code: "+1" },
  { flag: "🇬🇧", name: "United Kingdom", code: "+44" },
  { flag: "🇫🇷", name: "France", code: "+33" },
  { flag: "🇩🇪", name: "Germany", code: "+49" },
  { flag: "🇮🇹", name: "Italy", code: "+39" },
  { flag: "🇪🇸", name: "Spain", code: "+34" },
  { flag: "🇧🇪", name: "Belgium", code: "+32" },
  { flag: "🇨🇭", name: "Switzerland", code: "+41" },
  { flag: "🇳🇱", name: "Netherlands", code: "+31" },
  { flag: "🇸🇦", name: "Saudi Arabia", code: "+966" },
  { flag: "🇦🇪", name: "United Arab Emirates", code: "+971" },
  { flag: "🇶🇦", name: "Qatar", code: "+974" },
  { flag: "🇹🇷", name: "Turkey", code: "+90" },
  { flag: "🇮🇳", name: "India", code: "+91" },
  { flag: "🇨🇳", name: "China", code: "+86" },
  { flag: "🇯🇵", name: "Japan", code: "+81" },
  { flag: "🇧🇷", name: "Brazil", code: "+55" },
  { flag: "🇦🇺", name: "Australia", code: "+61" },
];

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+237");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (form.password.length < 4) {
      alert("Password must be at least 4 characters.");
      return;
    }

    const fullPhoneNumber = `${countryCode}${form.phone}`;

    const success = signup(
      form.name,
      form.email,
      form.password,
      fullPhoneNumber
    );

    if (!success) {
      alert("Email already exists.");
      return;
    }

    alert("Account created successfully.");
    navigate("/login");
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: googleUser.uid,
          name: googleUser.displayName,
          email: googleUser.email,
          photo: googleUser.photoURL,
          phone: "",
          role: "customer",
        })
      );

      navigate("/customer");
    } catch (error) {
      console.error(error);
      alert("Google signup failed.");
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
          Create your account and start shopping with us.
        </p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <div className="phone-row">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              required
            >
              {countryCodes.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.flag} {country.code} {country.name}
                </option>
              ))}
            </select>

            <input
              type="tel"
              placeholder="Phone number"
              required
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <div className="password-box">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({
                  ...form,
                  confirmPassword: e.target.value,
                })
              }
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button className="btn" type="submit">
            Create Account
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          type="button"
          className="google-btn"
          onClick={handleGoogleSignup}
        >
          Continue with Google
        </button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <div className="login-footer">
          <small>
            Secure Registration • Protected Access • Chafadia Enterprise
          </small>
        </div>
      </div>
    </div>
  );
}

export default Signup;