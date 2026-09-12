import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../app/apiauth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faMapMarkerAlt,
  faClipboardList,
  faUserCog,
  faSignOutAlt,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function Sidebarmenu() {
  const [isOpen, setIsOpen] = useState(false);

  const [logoutuser] = useLogoutUserMutation();

  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await logoutuser();
      localStorage.removeItem("user");
      setIsOpen(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <div className="leftsidebarmenu">
      {/* Menu Button */}
      <button
        type="button"
        className="dashmenu"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div>
            <h3>My Account</h3>
            <span>Manage your account</span>
          </div>

          <button
            type="button"
            className="btncloseside"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <nav className="clintmenu">
          <ul>
            <li>
              <Link to="/billingaddress" onClick={closeSidebar}>
                <span className="client-menu-icon address-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
                <span>Billing Address</span>
              </Link>
            </li>

            <li>
              <Link to="/clientorders" onClick={closeSidebar}>
                <span className="client-menu-icon orders-icon">
                  <FontAwesomeIcon icon={faClipboardList} />
                </span>
                <span>Orders</span>
              </Link>
            </li>

            <li>
              <Link to="/Profile" onClick={closeSidebar}>
                <span className="client-menu-icon account-icon">
                  <FontAwesomeIcon icon={faUserCog} />
                </span>
                <span>Account Details</span>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="client-logout"
                onClick={Logout}
              >
                <span className="client-menu-icon logout-icon">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default Sidebarmenu;