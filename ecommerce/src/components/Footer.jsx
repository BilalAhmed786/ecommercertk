import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faMobileAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify'
import { useNewsLetterMutation } from '../app/apiusers';
const Footer = () => {

  const [email, setEmail] = useState('');
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [newsLetter] = useNewsLetterMutation()

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCaptchaChange = (value) => {
    // CAPTCHA verification completed callback
    setIsCaptchaVerified(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {

      if (isCaptchaVerified) {
        // Here you can handle form submission, for example, send the email to your backend
        const result = await newsLetter({ email })

        if (result) {



          if (result.data !== 'field required') {


            toast.success(result.data)
            setEmail('');

          } else {

            toast.error(result.data)
          }

        } else {
          console.log('something wrong')
        }

      } else {

        toast.error('Please complete the CAPTCHA verification')

      }
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column-1">
          <h5>Newsletter for New Arrivals</h5>
          <div className="subscirber">
            <form onSubmit={handleFormSubmit}>
              <input
                className="emailsubscribe"
                name="email"
                type="text"
                placeholder="email"
                value={email}
                onChange={handleEmailChange}
              />
              <div className="captchafooter">
                <ReCAPTCHA
                  sitekey="6LdmnpgrAAAAADTs17lZXUjIddY9oH5BGozYTdbK"
                  onChange={handleCaptchaChange}
                  className="recaptchacontain"
                />
              </div>
              <div className="btn-subscribe">
                <button type="submit" className="btn btn-danger">Subscribe</button>
              </div>
            </form>
          </div>
          <p style={{ marginTop: 20, textAlign: 'justify' }}>
            Thrifters' Point is an online thrift store bringing high end brands to your doorstep at an affordable cost.
            All articles are handpicked from different thrift bazaars, making sure our customers get the best products available.
          </p>
        </div>

        <div className="footer-column-2">
          <h5>Quick Links</h5>
          <ul>
            <li><Link to="">Shop</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/checkout">Checkout</Link></li>
            <li><Link to="">About Us</Link></li>
          </ul>
        </div>

        <div className="footer-column-3">
          <h5>Contact Us</h5>
          <div>
            <h6><FontAwesomeIcon icon={faMapMarkerAlt} /> Address</h6>
            <p>Islamabad</p>
          </div>
          <div>
            <h6><FontAwesomeIcon icon={faMobileAlt} /> Phone</h6>
            <p>+923315195278</p>
          </div>
          <div>
            <h6><FontAwesomeIcon icon={faEnvelope} /> Email</h6>
            <p>fasst.sallar@gmail.com</p>
          </div>
          <div>
            <h6>Follow Us</h6>
            <div className="followus">
              <FontAwesomeIcon icon={faFacebookF} /> <FontAwesomeIcon icon={faInstagram} />
            </div>
          </div>
        </div>
      </div>
    </footer>


  );
};

export default Footer;
