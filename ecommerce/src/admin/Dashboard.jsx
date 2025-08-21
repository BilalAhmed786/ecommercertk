import Sidebarmenu from './component/Sidebarmenu';
import { Link } from 'react-router-dom';


function Dashboard({ user }) {
  return (
    <div className="dashboard-wrapper">
      <Sidebarmenu />

      <main className="dashboard-main">
        <div className="welcome-banner">
          <div className="marquee">
            <p>
              👋 Welcome <strong>{user?.username}</strong> — you're logged in as an admin!
            </p>
          </div>
        </div>

      

        <section className="dashboard-grid">
          <div className="dashboard-card">
            <Link to="/orders">📦 Orders</Link>
          </div>
          <div className="dashboard-card">
            <Link to="/alluser">👥 Users</Link>
          </div>
          <div className="dashboard-card">
            <Link to="/allproducts">🛍️ Products</Link>
          </div>
          <div className="dashboard-card">
            <Link to="/changepass">🔒 Change Password</Link>
          </div>
        </section>

      </main>
    </div>
  );
}
export default Dashboard;
