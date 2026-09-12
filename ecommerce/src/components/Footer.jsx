import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faMobileAlt,
  faEnvelope,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { useNewsLetterMutation } from '../app/apiusers';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [newsLetter] = useNewsLetterMutation();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    setIsCaptchaVerified(!!value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!isCaptchaVerified) {
      toast.error('Please complete the CAPTCHA verification');
      return;
    }

    try {
      const result = await newsLetter({ email });

      if (result?.data) {
        if (result.data !== 'field required') {
          toast.success(result.data);
          setEmail('');
          setIsCaptchaVerified(false);
        } else {
          toast.error(result.data);
        }
      } else {
        toast.error('Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to subscribe. Please try again.');
    }
  };

  return (
    <footer className="modern-footer">

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="footer-newsletter-inner">

          <div className="newsletter-content">
            <span className="newsletter-badge">STAY UPDATED</span>

            <h2>
              Discover something <span>special.</span>
            </h2>

            <p>
              Subscribe to our newsletter and be the first to know about
              new arrivals, exclusive deals and thrift finds.
            </p>
          </div>

          <div className="newsletter-form-wrapper">
            <form onSubmit={handleFormSubmit}>

              <div className="newsletter-input">
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmailChange}
                />

                <button type="submit">
                  Subscribe
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              </div>

              <div className="captcha-footer">
                <ReCAPTCHA
                  sitekey="6LdmnpgrAAAAADTs17lZXUjIddY9oH5BGozYTdbK"
                  onChange={handleCaptchaChange}
                />
              </div>

            </form>
          </div>

        </div>
      </div>


      {/* Main Footer */}
      <div className="footer-main">

        <div className="footer-container">

          {/* Brand */}
          <div className="footer-brand">

            <div className="footer-logo">
              Thrifters<span>'</span> Point
            </div>

            <p>
              High-end fashion without the high-end price.
              Every piece is handpicked from trusted thrift
              bazaars to bring you quality, unique and affordable
              fashion.
            </p>

            <div className="footer-socials">

              <a
                href="#"
                aria-label="Facebook"
                className="social-icon"
              >
                <FontAwesomeIcon icon={faFacebookF} />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="social-icon"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>

            </div>

          </div>


          {/* Quick Links */}
          <div className="footer-column">

            <h4>Quick Links</h4>

            <ul>
              <li>
                <Link to="/">Shop</Link>
              </li>

              <li>
                <Link to="/cart">Cart</Link>
              </li>

              <li>
                <Link to="/checkout">Checkout</Link>
              </li>

              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
            </ul>

          </div>


          {/* Customer */}
          <div className="footer-column">

            <h4>Customer Care</h4>

            <ul>
              <li>
                <Link to="/contactus">Contact Us</Link>
              </li>

              <li>
                <Link to="/orders">My Orders</Link>
              </li>

              <li>
                <Link to="/login">My Account</Link>
              </li>

              <li>
                <Link to="/aboutus">Our Story</Link>
              </li>
            </ul>

          </div>


          {/* Contact */}
          <div className="footer-contact">

            <h4>Get In Touch</h4>

            <div className="contact-item">

              <div className="contact-icon">
                <FontAwesomeIcon icon={faMapMarkerAlt} />
              </div>

              <div>
                <span>Location</span>
                <p>Islamabad, Pakistan</p>
              </div>

            </div>


            <div className="contact-item">

              <div className="contact-icon">
                <FontAwesomeIcon icon={faMobileAlt} />
              </div>

              <div>
                <span>Phone</span>
                <p>+92 334 5157899</p>
              </div>

            </div>


            <div className="contact-item">

              <div className="contact-icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <div>
                <span>Email</span>
                <p>we.thrift@gmail.com</p>
              </div>

            </div>

          </div>

        </div>

      </div>


      {/* Bottom Bar */}
      <div className="footer-bottom">

        <div className="footer-bottom-inner">

          <p>
            © {new Date().getFullYear()} Thrifters' Point.
            All rights reserved.
          </p>

          <p className="footer-made">
            Crafted for thrift lovers
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;