import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Users,
  ShoppingBag,
  Plus,
  SlidersHorizontal,
  Star,
  ClipboardList,
  FolderOpen,
  Coins,
  Truck,
  KeyRound,
} from "lucide-react";

import { useAllOrdersforadminQuery } from "../../app/apiorders";
import { useGetReviewsforadminQuery } from "../../app/apiproducts";

function Sidebarmenu() {
  const [search] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const location = useLocation();

  const {
    data: allorders,
    refetch: ordersRec,
  } = useAllOrdersforadminQuery(search);

  const {
    data: allreviews,
    refetch,
  } = useGetReviewsforadminQuery(search);

  const reviewpend = () => {
    if (!allreviews?.Reviews) return 0;

    return allreviews.Reviews.filter(
      (record) => record.status === "pending"
    ).length;
  };

  const orderpend = () => {
    if (!allorders?.orders) return 0;

    return allorders.orders.filter(
      (record) => record.status === "pending"
    ).length;
  };

  const openSidebar = () => {
    setIsOpen(true);
    ordersRec();
    refetch();
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: "All Users",
      path: "/alluser",
      icon: Users,
    },
    {
      label: "Products",
      path: "/allproducts",
      icon: ShoppingBag,
    },
    {
      label: "Add Product",
      path: "/addproduct",
      icon: Plus,
    },
    {
      label: "Product Filter",
      path: "/productfilter",
      icon: SlidersHorizontal,
    },
    {
      label: "Product Reviews",
      path: "/productreviews",
      icon: Star,
      badge: reviewpend(),
    },
    {
      label: "Orders",
      path: "/orders",
      icon: ClipboardList,
      badge: orderpend(),
    },
    {
      label: "Categories",
      path: "/addcategory",
      icon: FolderOpen,
    },
    {
      label: "Currency",
      path: "/addcurrency",
      icon: Coins,
    },
    {
      label: "Shipment",
      path: "/shipment",
      icon: Truck,
    },
    {
      label: "Change Password",
      path: "/changepass",
      icon: KeyRound,
    },
  ];

  return (
    <div className="leftsidebarmenu">

      {/* Open Sidebar */}
      <button
        className="dashmenu"
        onClick={openSidebar}
        aria-label="Open menu"
      >
        <Menu size={21} strokeWidth={2.2} />
      </button>

      {/* Dark Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        />
      )}

      {/* Fixed Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>

        {/* Header */}
        <div className="sidebar-header">

          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <ShoppingBag size={20} />
            </div>

            <div>
              <h3>Admin Panel</h3>
              <span>Store Management</span>
            </div>
          </div>

          <button
            className="btncloseside"
            onClick={closeSidebar}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>

        </div>

        {/* Menu Heading */}
        <div className="sidebar-menu-title">
          MANAGEMENT
        </div>

        {/* Menu */}
        <nav className="menu-list">

          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-menu-item ${
                  active ? "active" : ""
                }`}
                onClick={closeSidebar}
              >
                <span className="sidebar-menu-icon">
                  <Icon
                    size={18}
                    strokeWidth={2}
                  />
                </span>

                <span className="sidebar-menu-text">
                  {item.label}
                </span>

                {item.badge > 0 && (
                  <span className="tag">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

        </nav>

        {/* Bottom */}
        <div className="sidebar-bottom">
          <div className="sidebar-bottom-icon">
            <KeyRound size={16} />
          </div>

          <div>
            <strong>Administrator</strong>
            <span>Secure access</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sidebarmenu;


