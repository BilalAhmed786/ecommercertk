import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Users,
  Package,
  Lock,
  ArrowRight,
  ChartNoAxesCombined,
  ClipboardList,
  UserRound,
} from "lucide-react";

import Sidebarmenu from "./component/Sidebarmenu";

function Dashboard({ user }) {
  const dashboardItems = [
    {
      title: "Orders",
      description: "Manage and track customer orders",
      icon: <ShoppingBag size={22} strokeWidth={2} />,
      link: "/orders",
      className: "dashboard-blue",
    },
    {
      title: "Users",
      description: "View and manage registered users",
      icon: <Users size={22} strokeWidth={2} />,
      link: "/alluser",
      className: "dashboard-purple",
    },
    {
      title: "Products",
      description: "Manage your store products",
      icon: <Package size={22} strokeWidth={2} />,
      link: "/allproducts",
      className: "dashboard-green",
    },
    {
      title: "Security",
      description: "Update your account password",
      icon: <Lock size={22} strokeWidth={2} />,
      link: "/changepass",
      className: "dashboard-orange",
    },
  ];

  return (
    <div className="dashboard-wrapper">
      <Sidebarmenu />

      <main className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-small-label">
              ADMIN PANEL
            </span>

            <h1>Dashboard</h1>
          </div>

          <div className="dashboard-user">
            <div className="dashboard-avatar">
              <UserRound size={19} strokeWidth={2} />
            </div>

            <div className="dashboard-user-info">
              <strong>{user?.username || "Admin"}</strong>
              <span>Administrator</span>
            </div>
          </div>
        </header>

        {/* Welcome Hero */}
        <section className="dashboard-welcome">
          <div className="welcome-content">
            <span className="welcome-badge">
              <ChartNoAxesCombined size={15} />
              Admin Overview
            </span>

            <h2>
              Welcome back,{" "}
              <span>{user?.username || "Admin"}</span>
            </h2>

            <p>
              Manage your store, monitor orders, and keep everything
              running smoothly from your dashboard.
            </p>
          </div>

          <div className="welcome-decoration">
            <ClipboardList size={52} strokeWidth={1.5} />
          </div>
        </section>

        {/* Quick Stats */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon stat-blue">
              <ShoppingBag size={20} />
            </div>

            <div>
              <span>Orders</span>
              <strong>Manage orders</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-purple">
              <Users size={20} />
            </div>

            <div>
              <span>Customers</span>
              <strong>Manage users</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-green">
              <Package size={20} />
            </div>

            <div>
              <span>Inventory</span>
              <strong>Manage products</strong>
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <span>QUICK ACCESS</span>
              <h3>Manage your store</h3>
            </div>
          </div>

          <div className="dashboard-grid">
            {dashboardItems.map((item) => (
              <Link
                to={item.link}
                className={`dashboard-card ${item.className}`}
                key={item.title}
              >
                <div className="dashboard-card-top">
                  <div className="dashboard-card-icon">
                    {item.icon}
                  </div>

                  <span className="dashboard-arrow">
                    <ArrowRight size={15} />
                  </span>
                </div>

                <div className="dashboard-card-content">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </div>

                <div className="dashboard-card-line"></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
