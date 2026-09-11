import React, { useState } from "react";
import { useRegisterUserMutation } from "../app/apiauth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function Registeration() {
  const [registerData] = useRegisterUserMutation();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    retypepassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.password !== values.retypepassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await registerData(values);
      const messages = response?.data;

      if (Array.isArray(messages)) {
        messages.forEach((msg) => {
          if (msg === "registerd successfully") {
            toast.success(msg);
          } else {
            toast.error(msg);
          }
        });
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Registration failed");
    }
  };

  return (
    <section className="registration-page">
      <div className="registration-overlay">
        <div className="registration-container">
          <div className="registration-card">

            {/* =====================================================
                LEFT BRANDING
            ===================================================== */}

            <div className="registration-brand">
              <div className="registration-brand-content">

                <div className="registration-brand-logo">
                  🛍️
                </div>

                <h1>
                  Join the
                  <br />
                  Community.
                </h1>

                <p>
                  Create your account and discover amazing products,
                  exclusive deals and a better shopping experience.
                </p>

                <div className="registration-features">

                  <div>
                    <span>✓</span>
                    Easy & secure registration
                  </div>

                  <div>
                    <span>✓</span>
                    Exclusive shopping deals
                  </div>

                  <div>
                    <span>✓</span>
                    Fast and trusted delivery
                  </div>

                </div>

              </div>
            </div>

            {/* =====================================================
                REGISTRATION FORM
            ===================================================== */}

            <div className="registration-content">

              <div className="registration-header">

                <span className="registration-welcome">
                  GET STARTED
                </span>

                <h2>
                  Create your account
                </h2>

                <p>
                  Fill in your details below to get started.
                </p>

              </div>

              <form onSubmit={handleSubmit}>

                {/* NAME */}

                <div className="registration-field">

                  <label htmlFor="name">
                    Full Name
                  </label>

                  <div className="registration-input">

                    <span className="registration-input-icon">
                      👤
                    </span>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={values.name}
                      placeholder="Enter your full name"
                      autoComplete="name"
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div className="registration-field">

                  <label htmlFor="email">
                    Email Address
                  </label>

                  <div className="registration-input">

                    <span className="registration-input-icon">
                      ✉
                    </span>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={values.email}
                      placeholder="Enter your email"
                      autoComplete="username"
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* PASSWORD */}

                <div className="registration-field">

                  <label htmlFor="password">
                    Password
                  </label>

                  <div className="registration-input">

                    <span className="registration-input-icon">
                      🔒
                    </span>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      value={values.password}
                      placeholder="Create a password"
                      autoComplete="new-password"
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="registration-field">

                  <label htmlFor="retypepassword">
                    Confirm Password
                  </label>

                  <div className="registration-input">

                    <span className="registration-input-icon">
                      🔐
                    </span>

                    <input
                      id="retypepassword"
                      type="password"
                      name="retypepassword"
                      value={values.retypepassword}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      onChange={handleChange}
                      required
                    />

                  </div>

                </div>

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  className="registration-button"
                >
                  <span>
                    Create Account
                  </span>

                  <span className="registration-button-arrow">
                    →
                  </span>
                </button>

              </form>

              {/* LOGIN LINK */}

              <div className="registration-login">

                <span>
                  Already have an account?
                </span>

                <Link to="/login">
                  Sign in
                </Link>

              </div>

              {/* SECURITY */}

              <div className="registration-security">

                <span>
                  🔐
                </span>

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

export default Registeration;