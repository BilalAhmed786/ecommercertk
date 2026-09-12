import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStripePaymentMutation } from "../app/apiproducts";
import { useUserDetailsMutation } from "../app/apiauth";
import { useGetBillingaddressQuery } from "../app/apiorders";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCity,
  FaMapMarkerAlt,
  FaCreditCard,
  FaMoneyBillWave,
  FaLock,
  FaShoppingBag,
  FaArrowRight,
} from "react-icons/fa";
import { frontendurl } from "../baseurl/baseurl";
import loaderGif from "../assets/laoder.gif";

function Checkout(props) {
  const navigate = useNavigate();

  const shipmentcharges = props.data?.data?.[0]?.shipment || 0;
  const currency = props.data?.currency?.[0]?.currency || "";

  const cartdetails = useSelector((state) => state.cart.cart);

  const [data] = useUserDetailsMutation();
  const [userinfo, setUserinfo] = useState("");

  const { data: billingaddress, isLoading } =
    useGetBillingaddressQuery(
      userinfo ? userinfo?.useremail : ""
    );

  const [loading, setLoading] = useState(true);

  const [paymentMode] = useStripePaymentMutation();

  const stripe = useStripe();
  const elements = useElements();

  const [paymentMethod, setPaymentMethod] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    address: "",
    stripepayment: "",
  });


  /* =====================================================
     LOADER
  ===================================================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);


  /* =====================================================
     REDIRECT EMPTY CART
  ===================================================== */

  useEffect(() => {
    if (!cartdetails || cartdetails.length === 0) {
      navigate("/");
    }
  }, [cartdetails, navigate]);


  /* =====================================================
     FETCH USER
  ===================================================== */

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const result = await data();

        if (result?.data) {
          setUserinfo(result.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, []);


  /* =====================================================
     BILLING ADDRESS
  ===================================================== */

  useEffect(() => {
    if (billingaddress?.length > 0) {
      const defaultBilling = billingaddress[0];

      setPaymentMethod((prev) => ({
        ...prev,
        name: defaultBilling.name || "",
        email: defaultBilling.email || "",
        mobile: defaultBilling.mobile || "",
        city: defaultBilling.city || "",
        address: defaultBilling.address || "",
      }));
    }
  }, [billingaddress]);


  /* =====================================================
     SCROLL TOP
  ===================================================== */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  /* =====================================================
     CART DATA
  ===================================================== */

  const productname = cartdetails.map(
    (item) => item.productname
  );

  const productsprice = cartdetails.map(
    (item) => item.saleprice
  );

  const inventory = cartdetails.map(
    (item) => item.inventory
  );

  const productid = cartdetails.map(
    (item) => item._id
  );

  const productquantity = cartdetails.map(
    (item) => item.quantity
  );


  /* =====================================================
     TOTAL
  ===================================================== */

  const getTotalPrice = () => {
    return cartdetails.reduce(
      (total, item) =>
        total + item.saleprice * item.quantity,
      0
    );
  };

  const carttotal = getTotalPrice();

  const totalamount =
    Number(carttotal) + Number(shipmentcharges);


  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  const handlePaymentMethodChange = (e) => {
    const { name, value } = e.target;

    setPaymentMethod((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  /* =====================================================
     PAYMENT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod.stripepayment) {
      toast.error("Please select a payment method");
      return;
    }

    try {

      /* Stripe */

      if (paymentMethod.stripepayment === "Stripe") {

        if (!stripe || !elements) {
          toast.error("Stripe is not ready yet");
          return;
        }

        const cardElement =
          elements.getElement(CardElement);

        if (!cardElement) {
          toast.error("Please enter your card details");
          return;
        }

        const { token, error } =
          await stripe.createToken(cardElement);

        if (error) {
          toast.error(error.message);
          return;
        }

        if (token) {

          const result = await paymentMode({
            token: token.id,
            paymentMethod,
            productname,
            productid,
            productsprice,
            inventory,
            productquantity,
            carttotal,
            shipmentcharges,
            totalamount,
          });

          if (!result?.data?.msg) {
            toast.error(
              result?.data || "Payment failed"
            );
          } else {
            localStorage.removeItem("cartItems");
            window.location.href = frontendurl;
          }
        }

      }

      /* Cash On Delivery */

      else {

        const result = await paymentMode({
          paymentMethod,
          productname,
          productid,
          productsprice,
          inventory,
          productquantity,
          carttotal,
          shipmentcharges,
          totalamount,
        });

        if (!result?.data?.msg) {
          toast.error(
            result?.data || "Order could not be placed"
          );
        } else {
          toast.success(result.data.msg);

          localStorage.removeItem("cartItems");

          window.location.href = frontendurl;
        }
      }

    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong. Please try again."
      );
    }
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading || loading) {
    return (
      <div className="shop-loader">
        <img
          src={loaderGif}
          alt="Loading..."
        />
      </div>
    );
  }


  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div className="checkout-page">

      {/* Header */}

      <div className="checkout-header">

        <div>
          <span className="checkout-label">
            SECURE CHECKOUT
          </span>

          <h1>Complete your order</h1>

          <p>
            Enter your details and choose your preferred
            payment method.
          </p>
        </div>

        <div className="secure-checkout">
          <FaLock />
          <span>Secure & encrypted</span>
        </div>

      </div>


      {/* Main */}

      <form
        className="checkout-layout"
        onSubmit={handleSubmit}
      >

        {/* =================================================
            LEFT
        ================================================= */}

        <div className="checkout-details">

          {/* Customer Information */}

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-card-icon">
                <FaUser />
              </div>

              <div>
                <h2>Customer Information</h2>

                <p>
                  Where should we deliver your order?
                </p>
              </div>

            </div>


            <div className="checkout-fields">

              {/* Name */}

              <div className="checkout-field">

                <label>Name</label>

                <div className="input-with-icon">

                  <FaUser />

                  <input
                    type="text"
                    name="name"
                    value={paymentMethod.name}
                    onChange={handlePaymentMethodChange}
                    placeholder="Your full name"
                    required
                  />

                </div>

              </div>


              {/* Email */}

              <div className="checkout-field">

                <label>Email Address</label>

                <div className="input-with-icon">

                  <FaEnvelope />

                  <input
                    type="email"
                    name="email"
                    value={paymentMethod.email}
                    onChange={handlePaymentMethodChange}
                    placeholder="you@example.com"
                    required
                  />

                </div>

              </div>


              {/* Mobile */}

              <div className="checkout-field">

                <label>Contact Number</label>

                <div className="input-with-icon">

                  <FaPhone />

                  <input
                    type="text"
                    name="mobile"
                    value={paymentMethod.mobile}
                    onChange={handlePaymentMethodChange}
                    placeholder="+92 300 0000000"
                    required
                  />

                </div>

              </div>


              {/* City */}

              <div className="checkout-field">

                <label>City</label>

                <div className="input-with-icon">

                  <FaCity />

                  <input
                    type="text"
                    name="city"
                    value={paymentMethod.city}
                    onChange={handlePaymentMethodChange}
                    placeholder="Your city"
                    required
                  />

                </div>

              </div>


              {/* Address */}

              <div className="checkout-field checkout-field-full">

                <label>Delivery Address</label>

                <div className="input-with-icon textarea-wrapper">

                  <FaMapMarkerAlt />

                  <textarea
                    name="address"
                    rows="4"
                    value={paymentMethod.address}
                    onChange={handlePaymentMethodChange}
                    placeholder="Enter your complete delivery address"
                    required
                  />

                </div>

              </div>

            </div>

          </section>


          {/* Payment */}

          <section className="checkout-card">

            <div className="checkout-card-header">

              <div className="checkout-card-icon">
                <FaCreditCard />
              </div>

              <div>
                <h2>Payment Method</h2>

                <p>
                  Choose how you'd like to pay.
                </p>
              </div>

            </div>


            <div className="payment-methods">

              {/* Stripe */}

              <label
                className={`payment-option ${
                  paymentMethod.stripepayment === "Stripe"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="stripepayment"
                  value="Stripe"
                  checked={
                    paymentMethod.stripepayment === "Stripe"
                  }
                  onChange={handlePaymentMethodChange}
                  required
                />

                <div className="payment-option-icon">
                  <FaCreditCard />
                </div>

                <div className="payment-option-content">

                  <strong>Pay with Card</strong>

                  <span>
                    Secure payment powered by Stripe
                  </span>

                </div>

                <span className="payment-radio"></span>

              </label>


              {/* COD */}

              <label
                className={`payment-option ${
                  paymentMethod.stripepayment === "cod"
                    ? "selected"
                    : ""
                }`}
              >

                <input
                  type="radio"
                  name="stripepayment"
                  value="cod"
                  checked={
                    paymentMethod.stripepayment === "cod"
                  }
                  onChange={handlePaymentMethodChange}
                  required
                />

                <div className="payment-option-icon">
                  <FaMoneyBillWave />
                </div>

                <div className="payment-option-content">

                  <strong>Cash on Delivery</strong>

                  <span>
                    Pay when your order arrives
                  </span>

                </div>

                <span className="payment-radio"></span>

              </label>

            </div>


            {/* Stripe Card */}

            {paymentMethod.stripepayment === "Stripe" && (

              <div className="stripe-card-wrapper">

                <div className="stripe-card-header">

                  <span>Card Details</span>

                  <FaLock />

                </div>

                <div className="stripe-card">

                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "15px",
                          color: "#111827",
                          fontFamily:
                            "Inter, system-ui, sans-serif",
                          "::placeholder": {
                            color: "#9ca3af",
                          },
                        },
                        invalid: {
                          color: "#dc2626",
                        },
                      },
                    }}
                  />

                </div>

                <p className="stripe-security">
                  <FaLock />
                  Your payment information is securely
                  processed by Stripe.
                </p>

              </div>

            )}

          </section>

        </div>


        {/* =================================================
            RIGHT - ORDER SUMMARY
        ================================================= */}

        <aside className="checkout-summary">

          <div className="summary-card">

            <div className="summary-header">

              <div>

                <span className="summary-label">
                  YOUR ORDER
                </span>

                <h2>Order Summary</h2>

              </div>

              <div className="summary-bag">
                <FaShoppingBag />
              </div>

            </div>


            {/* Products */}

            <div className="summary-products">

              {cartdetails.map((product, index) => (

                <div
                  className="summary-product"
                  key={product._id || index}
                >

                  <div className="summary-product-number">
                    {index + 1}
                  </div>

                  <div className="summary-product-info">

                    <h3>
                      {product.productname}
                    </h3>

                    <span>
                      Quantity: {product.quantity}
                    </span>

                  </div>

                  <strong>
                    {currency}{" "}
                    {product.saleprice *
                      product.quantity}
                  </strong>

                </div>

              ))}

            </div>


            {/* Totals */}

            <div className="summary-divider"></div>

            <div className="summary-row">

              <span>Subtotal</span>

              <strong>
                {currency} {carttotal}
              </strong>

            </div>

            <div className="summary-row">

              <span>Delivery</span>

              <strong>
                {currency} {shipmentcharges}
              </strong>

            </div>


            <div className="summary-divider"></div>


            <div className="summary-total">

              <span>Total</span>

              <strong>
                {currency} {totalamount}
              </strong>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="place-order-btn"
            >

              <span>
                {paymentMethod.stripepayment === "Stripe"
                  ? "Pay Securely"
                  : "Place Order"}
              </span>

              <FaArrowRight />

            </button>


            <div className="checkout-trust">

              <div>
                <FaLock />
                <span>Secure checkout</span>
              </div>

              <div>
                <FaShoppingBag />
                <span>Quality products</span>
              </div>

            </div>

          </div>

        </aside>

      </form>

    </div>
  );
}

export default Checkout;



