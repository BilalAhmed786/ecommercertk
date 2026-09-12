import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";

import {
  useLogoutUserMutation,
  useUserDetailsMutation,
} from "../app/apiauth";

import Hamburger from "./hamburger";
import Cartpreview from "./Cartpreview";
import { backendurl, frontendurl } from "../baseurl/baseurl";

function Header() {
  const [refetchuser] = useUserDetailsMutation();
  const [logoutuser] = useLogoutUserMutation();

  const totalQuantity = useSelector(
    (state) => state.cart.cart.length
  );

  const [register, setRegister] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userdata, setUserdata] = useState(null);

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleUserAuth = () => {
    setRegister((prev) => !prev);
  };

  const handleLogoutuser = async () => {
    try {
      const logout = await logoutuser();

      if (logout?.data || logout) {
        setUserdata(null);
        setRegister(false);
        setIsOpen(false);

        navigate("/login", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const getuser = async () => {
      try {
        const response = await refetchuser();

        if (!mounted) return;

        setUserdata(response?.data || null);
      } catch (error) {
        if (!mounted) return;

        setUserdata(null);
      }
    };

    getuser();

    return () => {
      mounted = false;
    };
  }, [refetchuser]);

  return (
    <header className="headercontainer">
      <div className="headercontent">

        <div className="logocontainer">
          <div className="site-logo-contianer">
            <Link to={frontendurl}>
              <img
                className="site-logo"
                src={`${backendurl}/uploads/thrifter.png`}
                alt="Logo"
              />
            </Link>
          </div>

          <div className="header-user-area">
            {!userdata?.userrole ? (
              <>
                <button
                  type="button"
                  className="userbutton"
                  onClick={handleUserAuth}
                  aria-label="User menu"
                >
                  <User size={20} />
                  <ChevronDown
                    size={16}
                    className={
                      register ? "user-chevron-open" : ""
                    }
                  />
                </button>

                {register && (
                  <div className="dropdownuser">
                    <Link
                      to="/login"
                      onClick={() => setRegister(false)}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setRegister(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <button
                type="button"
                className="logouticon"
                onClick={handleLogoutuser}
                aria-label="Logout"
              >
                <LogOut size={19} />
              </button>
            )}
          </div>
        </div>

        <nav className="navmenu">
          <Link to="/">Shop</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/checkout">Checkout</Link>
          <Link to="/aboutus">About us</Link>

          {userdata?.userrole === "admin" && (
            <Link to="/dashboard">Dashboard</Link>
          )}

          {userdata?.userrole === "subscriber" && (
            <Link to="/client">Dashboard</Link>
          )}
        </nav>

        <div className="iconcontainer">
          <div className="iconsetup">
            <Link to="/cart">
              <ShoppingBag
                className="carticon"
                size={21}
              />

              {totalQuantity > 0 && (
                <span className="qunatity">
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>

          <div className="cartpreview">
            <Cartpreview />
          </div>
        </div>

        <Hamburger
          toggleMenu={toggleMenu}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          userdata={userdata}
          handleLogoutuser={handleLogoutuser}
        />
      </div>
    </header>
  );
}

export default Header;
