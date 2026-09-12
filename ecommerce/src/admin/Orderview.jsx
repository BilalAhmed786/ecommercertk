import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  CheckCircle2,
  Clock3,
  XCircle,
  Receipt,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

import Sidebarmenu from "./component/Sidebarmenu";

import {
  useGetSingleorderforadminQuery,
  useSingleOrderStatusMutation,
} from "../app/apiorders";

import { useGetCurrencyQuery } from "../app/apiproducts";

function Orderview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useGetSingleorderforadminQuery(id);

  const { data: currency } = useGetCurrencyQuery();

  const [ordersingleStatus, { isLoading: isUpdating }] =
    useSingleOrderStatusMutation();

  const [orderstatus, setOrderstatus] = useState("");

  const userdata = data?.[0];
  const curr = currency?.[0] || {};

  const productsname = userdata?.productname || [];
  const productsquantity = userdata?.productquantity || [];
  const productsprice = userdata?.productsprice || [];

  const productsid = userdata?._id;

  const handleStatusChange = (e) => {
    setOrderstatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderstatus) {
      toast.error("Please select an order status");
      return;
    }

    try {
      const result = await ordersingleStatus({
        status: { status: orderstatus },
        productsname,
        productsquantity,
        productsid,
      });

      if (result?.data === "update successfully") {
        toast.success(result.data);
        setOrderstatus("");
        refetch();
      } else {
        toast.error(result?.data || "Unable to update order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const getStatusClass = (status) => {
    const normalized = status?.toLowerCase();

    if (
      normalized === "fulfilled" ||
      normalized === "completed" ||
      normalized === "delivered"
    ) {
      return "order-status fulfilled";
    }

    if (normalized === "pending") {
      return "order-status pending";
    }

    if (
      normalized === "cancelled" ||
      normalized === "return"
    ) {
      return "order-status cancelled";
    }

    return "order-status default";
  };

  const getStatusIcon = (status) => {
    const normalized = status?.toLowerCase();

    if (
      normalized === "fulfilled" ||
      normalized === "completed" ||
      normalized === "delivered"
    ) {
      return <CheckCircle2 size={15} />;
    }

    if (normalized === "pending") {
      return <Clock3 size={15} />;
    }

    if (
      normalized === "cancelled" ||
      normalized === "return"
    ) {
      return <XCircle size={15} />;
    }

    return <Package size={15} />;
  };

  if (isLoading) {
    return (
      <div className="orderview-page">
        <Sidebarmenu />

        <main className="orderview-main">
          <div className="orderview-loading">
            <div className="orderview-spinner" />
            <p>Loading order details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !userdata) {
    return (
      <div className="orderview-page">
        <Sidebarmenu />

        <main className="orderview-main">
          <div className="orderview-error">
            <div className="orderview-error-icon">
              <XCircle size={28} />
            </div>

            <h2>Unable to load order</h2>
            <p>
              We couldn't find the requested order details.
            </p>

            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="orderview-back-btn"
            >
              <ArrowLeft size={17} />
              Back to Orders
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="orderview-page">
      <Sidebarmenu />

      <main className="orderview-main">
        {/* =================================
            HEADER
        ================================= */}

        <div className="orderview-header">
          <div>
            <div className="orderview-breadcrumb">
              <span>Dashboard</span>
              <ChevronRight size={14} />
              <span>Orders</span>
              <ChevronRight size={14} />
              <strong>Order Details</strong>
            </div>

            <div className="orderview-title-row">
              <div className="orderview-title-icon">
                <Receipt size={24} />
              </div>

              <div>
                <h1>Order Details</h1>
                <p>
                  Review and manage this customer order
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="orderview-back-btn"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft size={17} />
            All Orders
          </button>
        </div>

        {/* =================================
            ORDER TOP INFO
        ================================= */}

        <div className="orderview-top-grid">
          <div className="orderview-info-card">
            <div className="orderview-info-icon blue">
              <ShoppingBag size={20} />
            </div>

            <div>
              <span>Order</span>
              <strong>
                #{userdata?._id?.slice(-8)?.toUpperCase()}
              </strong>
            </div>
          </div>

          <div className="orderview-info-card">
            <div className="orderview-info-icon purple">
              <Package size={20} />
            </div>

            <div>
              <span>Products</span>
              <strong>{productsname.length}</strong>
            </div>
          </div>

          <div className="orderview-info-card">
            <div className="orderview-info-icon green">
              <CreditCard size={20} />
            </div>

            <div>
              <span>Total Amount</span>
              <strong>
                {curr.currency} {userdata?.totalamount}
              </strong>
            </div>
          </div>

          <div className="orderview-info-card">
            <div className="orderview-info-icon orange">
              {getStatusIcon(userdata?.status)}
            </div>

            <div>
              <span>Status</span>
              <strong className="orderview-current-status">
                {userdata?.status || "Unknown"}
              </strong>
            </div>
          </div>
        </div>

        {/* =================================
            MAIN GRID
        ================================= */}

        <div className="orderview-content-grid">
          {/* =================================
              LEFT
          ================================= */}

          <div className="orderview-left">
            {/* Products */}

            <section className="orderview-card">
              <div className="orderview-card-header">
                <div>
                  <div className="orderview-card-title">
                    <Package size={18} />
                    <h2>Order Items</h2>
                  </div>

                  <p>
                    Products included in this order
                  </p>
                </div>

                <span className="orderview-items-count">
                  {productsname.length} items
                </span>
              </div>

              <div className="orderview-products">
                {productsname.map((name, index) => (
                  <div
                    className="orderview-product"
                    key={`${name}-${index}`}
                  >
                    <div className="orderview-product-number">
                      {index + 1}
                    </div>

                    <div className="orderview-product-info">
                      <strong>{name}</strong>
                      <span>Product</span>
                    </div>

                    <div className="orderview-product-quantity">
                      <span>Qty</span>
                      <strong>
                        {productsquantity[index] || 0}
                      </strong>
                    </div>

                    <div className="orderview-product-price">
                      <span>Price</span>
                      <strong>
                        {curr.currency}{" "}
                        {productsprice[index] || 0}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}

              <div className="orderview-total-section">
                <div className="orderview-total-row">
                  <span>Cart Total</span>
                  <strong>
                    {curr.currency} {userdata?.carttotal || 0}
                  </strong>
                </div>

                <div className="orderview-total-row">
                  <span>Shipment</span>
                  <strong>
                    {curr.currency}{" "}
                    {userdata?.shipmentcharges || 0}
                  </strong>
                </div>

                <div className="orderview-total-divider" />

                <div className="orderview-total-row grand-total">
                  <span>Total</span>

                  <strong>
                    {curr.currency}{" "}
                    {userdata?.totalamount || 0}
                  </strong>
                </div>
              </div>
            </section>

            {/* Status */}

            <section className="orderview-card">
              <div className="orderview-card-header">
                <div>
                  <div className="orderview-card-title">
                    <RefreshCw size={18} />
                    <h2>Update Order Status</h2>
                  </div>

                  <p>
                    Change the current status of this order
                  </p>
                </div>

                <span className={getStatusClass(userdata?.status)}>
                  {getStatusIcon(userdata?.status)}
                  {userdata?.status || "Unknown"}
                </span>
              </div>

              <form
                className="orderview-status-form"
                onSubmit={handleSubmit}
              >
                <div className="orderview-select-wrapper">
                  <select
                    value={orderstatus}
                    onChange={handleStatusChange}
                    className="orderview-status-select"
                  >
                    <option value="">
                      Select New Status
                    </option>

                    <option value="pending">
                      Pending
                    </option>

                    <option value="return">
                      Return
                    </option>

                    <option value="fulfilled">
                      Fulfilled
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="orderview-update-btn"
                  disabled={isUpdating || !orderstatus}
                >
                  <RefreshCw
                    size={17}
                    className={
                      isUpdating
                        ? "orderview-spin"
                        : ""
                    }
                  />

                  {isUpdating
                    ? "Updating..."
                    : "Update Status"}
                </button>
              </form>
            </section>
          </div>

          {/* =================================
              RIGHT
          ================================= */}

          <aside className="orderview-right">
            <section className="orderview-card biller-card">
              <div className="orderview-card-header">
                <div>
                  <div className="orderview-card-title">
                    <User size={18} />
                    <h2>Customer Details</h2>
                  </div>

                  <p>Customer information</p>
                </div>
              </div>

              <div className="orderview-customer-profile">
                <div className="orderview-customer-avatar">
                  {userdata?.name
                    ?.charAt(0)
                    ?.toUpperCase() || "U"}
                </div>

                <div>
                  <strong>
                    {userdata?.name || "Unknown Customer"}
                  </strong>

                  <span>Customer</span>
                </div>
              </div>

              <div className="orderview-contact-list">
                <div className="orderview-contact-item">
                  <div className="orderview-contact-icon">
                    <Mail size={16} />
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {userdata?.email || "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="orderview-contact-item">
                  <div className="orderview-contact-icon">
                    <Phone size={16} />
                  </div>

                  <div>
                    <span>Mobile</span>
                    <strong>
                      {userdata?.mobile || "N/A"}
                    </strong>
                  </div>
                </div>

                <div className="orderview-contact-item">
                  <div className="orderview-contact-icon">
                    <MapPin size={16} />
                  </div>

                  <div>
                    <span>Address</span>
                    <strong>
                      {userdata?.address || "N/A"}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment / Shipment */}

            <section className="orderview-card">
              <div className="orderview-card-header">
                <div>
                  <div className="orderview-card-title">
                    <Truck size={18} />
                    <h2>Order Summary</h2>
                  </div>

                  <p>Payment and delivery information</p>
                </div>
              </div>

              <div className="orderview-summary-list">
                <div>
                  <span>Cart Total</span>
                  <strong>
                    {curr.currency}{" "}
                    {userdata?.carttotal || 0}
                  </strong>
                </div>

                <div>
                  <span>Shipping</span>
                  <strong>
                    {curr.currency}{" "}
                    {userdata?.shipmentcharges || 0}
                  </strong>
                </div>

                <div className="summary-total">
                  <span>Order Total</span>
                  <strong>
                    {curr.currency}{" "}
                    {userdata?.totalamount || 0}
                  </strong>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Orderview;