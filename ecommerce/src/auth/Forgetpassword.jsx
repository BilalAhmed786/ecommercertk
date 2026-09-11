import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgetpasswordMutation } from "../app/apiauth";
import { toast } from "react-toastify";

function Forgetpassword() {
  const [Userdata] = useForgetpasswordMutation();

  const [Forget, ForgteState] = useState({
    email: "",
  });

  const ForgetUser = (e) => {
    const { name, value } = e.target;

    ForgteState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const ForgetCread = async (e) => {
    e.preventDefault();

    try {
      const validation = await Userdata(Forget);
      const message = validation?.data;

      if (message === "Password reset email sent") {
        toast.success(message);
      } else {
        toast.error(message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Unable to send reset email");
      console.log(error);
    }
  };

  return (
    <section className="forgot-page">
      <div className="forgot-overlay">
        <div className="forgot-container">
          <div className="forgot-card">

            {/* LEFT BRANDING */}
            <div className="forgot-brand">
              <div className="forgot-brand-content">
                <div className="forgot-brand-logo">🔐</div>

                <h1>
                  Secure Your
                  <br />
                  Account.
                </h1>

                <p>
                  Don't worry, it happens. Enter your email address and
                  we'll send you a secure link to reset your password.
                </p>

                <div className="forgot-features">
                  <div>
                    <span>✓</span>
                    Secure password recovery
                  </div>

                  <div>
                    <span>✓</span>
                    Quick and easy process
                  </div>

                  <div>
                    <span>✓</span>
                    Your account stays protected
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="forgot-content">

              <div className="forgot-header">
                <span className="forgot-welcome">
                  PASSWORD RECOVERY
                </span>

                <h2>Forgot your password?</h2>

                <p>
                  Enter your email address and we'll send you a
                  password reset link.
                </p>
              </div>

              <form onSubmit={ForgetCread}>

                <div className="forgot-field">
                  <label htmlFor="forgot-email">
                    Email Address
                  </label>

                  <div className="forgot-input">
                    <span className="forgot-input-icon">
                      ✉
                    </span>

                    <input
                      id="forgot-email"
                      type="email"
                      name="email"
                      value={Forget.email}
                      placeholder="Enter your email"
                      autoComplete="email"
                      onChange={ForgetUser}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="forgot-button"
                >
                  <span>Send Reset Link</span>
                  <span className="forgot-button-arrow">
                    →
                  </span>
                </button>
              </form>

              <div className="forgot-back">
                <span>Remember your password?</span>

                <Link to="/login">
                  Sign in
                </Link>
              </div>

              <div className="forgot-security">
                <span>🔒</span>
                <span>
                  Your information is securely protected
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Forgetpassword;