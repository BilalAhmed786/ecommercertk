import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLoginUserMutation, useUserDetailsMutation } from '../app/apiauth';
import ReCAPTCHA from 'react-google-recaptcha';

function Login() {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [loginuser] = useLoginUserMutation();
  const [userData] = useUserDetailsMutation();

  const [login, setLogin] = useState({
    email: '',
    password: '',
  });

  const handleCaptchaChange = () => {
    setIsCaptchaVerified(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin((prev) => ({ ...prev, [name]: value }));
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

      if (resData?.role === 'admin') {
        window.location.href = '/dashboard';
      } else if (resData?.role === 'subscriber') {
        window.location.href = '/client';
      } else {
        toast.error('Invalid role');
      }

      await userData(); // For global context (if needed)

    } catch (err) {
      toast.error('Login failed');
    }
  };


  return (
    <section className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Login</h2>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      autoComplete="username"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      className="form-control form-control-lg"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="recaptchacontain">
                    <ReCAPTCHA
                      sitekey="6LdmnpgrAAAAADTs17lZXUjIddY9oH5BGozYTdbK"
                      onChange={handleCaptchaChange}
                      
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-danger">Login</button>
                  </div>

                  <p className="text-center text-muted mt-4 mb-0">
                    Forget your password?{' '}
                    <Link to="/Forget-password" className="fw-bold text-decoration-none">
                      Reset here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
