import React from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  CalendarDays,
  MapPin,
  Mail,
  Phone,
  Receipt,
  Truck,
  CreditCard,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import Sidebarmenu from "./component/Sidebarmenu";
import {
  useGetSingleorderforclientQuery,
} from "../app/apiorders";
import { useGetCurrencyQuery } from "../app/apiproducts";


function Clientordersview() {
  const { id } = useParams();

  const {
    data,
    error,
    isLoading,
  } = useGetSingleorderforclientQuery(id);

  const { data: currency } = useGetCurrencyQuery();

  const userdata = data?.[0];
  const curr = currency?.[0];

  const productNames = userdata?.productname || [];
  const productQuantities = userdata?.productquantity || [];
  const productPrices = userdata?.productsprice || [];

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return "client-view-status delivered";

      case "confirmed":
      case "processing":
        return "client-view-status confirmed";

      case "pending":
        return "client-view-status pending";

      case "cancelled":
      case "canceled":
        return "client-view-status cancelled";

      default:
        return "client-view-status default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "completed":
        return <CheckCircle2 size={16} />;

      case "confirmed":
      case "processing":
        return <Package size={16} />;

      case "pending":
        return <Clock3 size={16} />;

      case "cancelled":
      case "canceled":
        return <XCircle size={16} />;

      default:
        return <Package size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="client-order-view-loading">
        <Package size={30} className="client-order-loading-icon" />
        <span>Loading order details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-order-view-error">
        <div className="client-order-error-icon">
          <XCircle size={30} />
        </div>

        <h2>Unable to load order</h2>
        <p>
          Something went wrong while loading this order. Please try again.
        </p>

        <Link to="/clientorders" className="client-order-error-btn">
          <ArrowLeft size={17} />
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!userdata) {
    return (
      <div className="client-order-view-error">
        <div className="client-order-error-icon">
          <Package size={30} />
        </div>

        <h2>Order not found</h2>
        <p>
          We couldn't find the order you're looking for.
        </p>

        <Link to="/clientorders" className="client-order-error-btn">
          <ArrowLeft size={17} />
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="dashboardcontainer">
      <Sidebarmenu />

      <main className="client-order-view-page">
        {/* Header */}
        <div className="client-order-view-header">
          <Link to="/clientorders" className="client-order-back">
            <ArrowLeft size={17} />
            All Orders
          </Link>

          <div className="client-order-heading">
            <div>
              <div className="client-order-heading-top">
                <div className="client-order-title-icon">
                  <Receipt size={23} />
                </div>

                <div>
                  <h1>Order Details</h1>
                  <p>Review your order information and billing details.</p>
                </div>
              </div>
            </div>

            <div className={getStatusClass(userdata.status)}>
              {getStatusIcon(userdata.status)}
              <span>{userdata.status || "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Order information */}
        <section className="client-order-info-grid">
          <div className="client-order-info-card">
            <div className="client-order-info-icon">
              <Package size={19} />
            </div>

            <div>
              <span>Order Items</span>
              <strong>
                {productNames.length}{" "}
                {productNames.length === 1 ? "Item" : "Items"}
              </strong>
            </div>
          </div>

          <div className="client-order-info-card">
            <div className="client-order-info-icon date-icon">
              <CalendarDays size={19} />
            </div>

            <div>
              <span>Order Date</span>
              <strong>{userdata.timestamp || "N/A"}</strong>
            </div>
          </div>

          <div className="client-order-info-card">
            <div className="client-order-info-icon payment-icon">
              <CreditCard size={19} />
            </div>

            <div>
              <span>Payment</span>
              <strong>Order Payment</strong>
            </div>
          </div>
        </section>

        {/* Main layout */}
        <div className="client-order-view-grid">
          {/* Products */}
          <section className="client-order-products-card">
            <div className="client-order-card-header">
              <div>
                <h2>Order Items</h2>
                <p>Products included in this order.</p>
              </div>

              <span className="client-order-item-count">
                {productNames.length} items
              </span>
            </div>

            <div className="client-order-products">
              {productNames.map((product, index) => (
                <div className="client-order-product" key={`${product}-${index}`}>
                  <div className="client-product-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="client-product-info">
                    <strong>{product}</strong>
                    <span>
                      Quantity: {productQuantities[index] || 0}
                    </span>
                  </div>

                  <div className="client-product-price">
                    {curr?.currency || ""}{" "}
                    {productPrices[index] || 0}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="client-order-total-section">
              <div className="client-order-total-row">
                <span>Cart Total</span>
                <strong>
                  {curr?.currency || ""} {userdata.carttotal || 0}
                </strong>
              </div>

              <div className="client-order-total-row">
                <span>
                  <Truck size={15} />
                  Shipment
                </span>

                <strong>
                  {curr?.currency || ""}{" "}
                  {userdata.shipmentcharges || 0}
                </strong>
              </div>

              <div className="client-order-total-row final-total">
                <span>Total Amount</span>

                <strong>
                  {curr?.currency || ""} {userdata.totalamount || 0}
                </strong>
              </div>
            </div>
          </section>

          {/* Billing */}
          <aside className="client-billing-card">
            <div className="client-order-card-header">
              <div>
                <h2>Billing Details</h2>
                <p>Information provided for this order.</p>
              </div>
            </div>

            <div className="client-billing-details">
              <div className="client-billing-item">
                <div className="client-billing-icon">
                  <MapPin size={17} />
                </div>

                <div>
                  <span>Address</span>
                  <strong>{userdata.address || "N/A"}</strong>
                </div>
              </div>

              <div className="client-billing-item">
                <div className="client-billing-icon email-icon">
                  <Mail size={17} />
                </div>

                <div>
                  <span>Email</span>
                  <strong>{userdata.email || "N/A"}</strong>
                </div>
              </div>

              <div className="client-billing-item">
                <div className="client-billing-icon phone-icon">
                  <Phone size={17} />
                </div>

                <div>
                  <span>Contact Number</span>
                  <strong>{userdata.mobile || "N/A"}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Clientordersview;
