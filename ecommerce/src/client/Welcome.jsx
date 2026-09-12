import Sidebarmenu from "./component/Sidebarmenu";
import {
  ShoppingBag,
  MapPin,
  UserRound,
  ArrowRight,
  Sparkles,
  Hand
} from "lucide-react";
import { Link } from "react-router-dom";


function Welcome({ username }) {
  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="welcome-main">
        <section className="welcome-hero">
          <div className="welcome-decoration welcome-decoration-one" />
          <div className="welcome-decoration welcome-decoration-two" />

          <div className="welcome-hero-content">
            <div className="welcome-text">
              <div className="welcome-label">
                <Sparkles size={15} />
                <span>Customer Dashboard</span>
              </div>

              <h1>
                Welcome back,{" "}
                <span>{username || "there"}</span>
                <span className="welcome-wave"><Hand className="welcome-wave" size={34} /></span>
              </h1>

              <p>
                Manage your orders, account details, and billing information
                all from one convenient place.
              </p>

              <div className="welcome-actions">
                <Link to="/clientorders" className="welcome-primary-btn">
                  <ShoppingBag size={18} />
                  View My Orders
                  <ArrowRight size={17} />
                </Link>

                <Link to="/Profile" className="welcome-secondary-btn">
                  <UserRound size={17} />
                  Account Details
                </Link>
              </div>
            </div>

            <div className="welcome-visual">
              <div className="welcome-visual-glow" />

              <div className="welcome-icon-card">
                <ShoppingBag size={46} />
              </div>

              <div className="floating-card floating-card-orders">
                <div className="floating-icon orders-floating-icon">
                  <ShoppingBag size={17} />
                </div>
                <div>
                  <strong>Orders</strong>
                  <span>Track your purchases</span>
                </div>
              </div>

              <div className="floating-card floating-card-profile">
                <div className="floating-icon profile-floating-icon">
                  <UserRound size={17} />
                </div>
                <div>
                  <strong>Profile</strong>
                  <span>Keep it updated</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-shortcuts">
          <div className="shortcut-card">
            <div className="shortcut-icon shortcut-orders">
              <ShoppingBag size={22} />
            </div>

            <div className="shortcut-content">
              <h3>My Orders</h3>
              <p>View and track your recent orders.</p>
            </div>

            <Link to="/clientorders" className="shortcut-arrow">
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="shortcut-card">
            <div className="shortcut-icon shortcut-address">
              <MapPin size={22} />
            </div>

            <div className="shortcut-content">
              <h3>Billing Address</h3>
              <p>Manage your saved billing information.</p>
            </div>

            <Link to="/billingaddress" className="shortcut-arrow">
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="shortcut-card">
            <div className="shortcut-icon shortcut-profile">
              <UserRound size={22} />
            </div>

            <div className="shortcut-content">
              <h3>Account Details</h3>
              <p>Update your personal account information.</p>
            </div>

            <Link to="/Profile" className="shortcut-arrow">
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Welcome;
