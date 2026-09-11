import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useLoginUserMutation,
  useUserDetailsMutation,
} from '../app/apiauth';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [loginuser] = useLoginUserMutation();
  const [userData] = useUserDetailsMutation();

  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(!!value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLogin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!login.email || !login.password) {
      toast.error('Email and password are required');
      return;
    }

    if (!isCaptchaVerified) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }

    try {
      const response = await loginuser(login);
      const resData = response?.data;

      if (resData?.error) {
        toast.error(resData.error);
        return;
      }

      await userData();

      if (resData?.role === 'admin') {
        window.location.href = '/dashboard';
      } else if (resData?.role === 'subscriber') {
        window.location.href = '/client';
      } else {
        toast.error('Invalid role');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  return (
    <section className="login-page">
      <div className="login-overlay">

        <div className="login-container">

          <div className="login-card">

            {/* Left Branding Section */}
            <div className="login-brand">

              <div className="brand-content">
                <div className="brand-logo">
                  🛍️
                </div>

                <h1>
                  Shop Smarter.
                  <br />
                  Live Better.
                </h1>

                <p>
                  Discover amazing products, exclusive deals
                  and everything you need in one place.
                </p>

                <div className="brand-features">
                  <div>
                    <span>✓</span>
                    Secure shopping
                  </div>

                  <div>
                    <span>✓</span>
                    Fast delivery
                  </div>

                  <div>
                    <span>✓</span>
                    Trusted service
                  </div>
                </div>
              </div>

            </div>

            {/* Login Section */}
            <div className="login-content">

              <div className="login-header">

                <span className="welcome-text">
                  WELCOME BACK
                </span>

                <h2>Sign in to your account</h2>

                <p>
                  Enter your details below to continue.
                </p>

              </div>

              <form onSubmit={handleSubmit}>

                {/* Email */}
                <div className="login-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <div className="login-input">

                    <span className="input-icon">
                      ✉
                    </span>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={login.email}
                      autoComplete="username"
                      placeholder="Enter your email"
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* Password */}
                <div className="login-field">

                  <div className="password-label">
                    <label htmlFor="password">
                      Password
                    </label>

                    <Link to="/Forget-password">
                      Forgot password?
                    </Link>
                  </div>

                  <div className="login-input">

                    <span className="input-icon">
                      🔒
                    </span>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={login.password}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* CAPTCHA */}
                <div className="captcha-box">
                  <ReCAPTCHA
                    sitekey="6LdmnpgrAAAAADTs17lZXUjIddY9oH5BGozYTdbK"
                    onChange={handleCaptchaChange}
                  />
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  className="login-button"
                >
                  <span>Sign In</span>

                  <span className="button-arrow">
                    →
                  </span>
                </button>

              </form>

              <div className="login-security">
                <span>🔐</span>
                <span>Your information is securely protected</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Login;
