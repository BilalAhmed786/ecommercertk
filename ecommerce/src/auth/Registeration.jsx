import React, { useState } from 'react';
import { useRegisterUserMutation } from '../app/apiauth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom'; // use Link if using React Router

function Registeration() {
  const [registerData] = useRegisterUserMutation();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    retypepassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await registerData(values);
      const messages = response?.data;

      if (Array.isArray(messages)) {
        messages.forEach((msg) => {
          if (msg === 'registerd successfully') toast.success(msg);
          else toast.error(msg);
        });
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      toast.error('Registration failed');
    }
  };

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Create an Account</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      onChange={handleChange}
                      value={values.name}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      autoComplete="username"
                      onChange={handleChange}
                      value={values.email}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      autoComplete="new-password"
                      onChange={handleChange}
                      value={values.password}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="retypepassword" className="form-label">Repeat Password</label>
                    <input
                      type="password"
                      name="retypepassword"
                      className="form-control"
                      autoComplete="new-password"
                      onChange={handleChange}
                      value={values.retypepassword}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-danger">
                      Register
                    </button>
                  </div>

                  <p className="text-center text-muted mt-4 mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="fw-bold text-decoration-none">
                      Login here
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

export default Registeration;
