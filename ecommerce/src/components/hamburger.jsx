import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Hamburger({
  setIsOpen,
  toggleMenu,
  isOpen,
  userdata,
  handleLogoutuser,
}) {
  return (
    <>
      <div className="hamburgercontainer">
        <button
          type="button"
          className="hamburger-button"
          onClick={toggleMenu}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className={`dropdown-hamburger ${isOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              Shop
            </Link>
          </li>

          <li>
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              Cart
            </Link>
          </li>

          <li>
            <Link to="/checkout" onClick={() => setIsOpen(false)}>
              Checkout
            </Link>
          </li>

          {!userdata?.userrole ? (
            <>
              <li>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
              </li>

              <li>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              {userdata?.userrole === "admin" && (
                <li>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {userdata?.userrole === "subscriber" && (
                <li>
                  <Link
                    to="/client"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/"
                  onClick={handleLogoutuser}
                >
                  Logout
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}