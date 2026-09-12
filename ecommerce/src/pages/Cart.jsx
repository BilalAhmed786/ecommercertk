import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faMinus,
  faPlus,
  faShoppingBag,
  faArrowRight,
  faArrowLeft,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';
import {
  decreaseQuantity,
  removeFromCart,
  increaseQuantity,
} from '../reducers/cartslice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useGetCurrencyQuery,
  useGetProductssliderQuery,
} from '../app/apiproducts';
import Slider from 'react-slick';
import { settings } from '../components/slickcrousel';
import { backendurl } from '../baseurl/baseurl';
import { useState, useEffect } from 'react';
import loaderGif from '../assets/laoder.gif';

function Cart() {
  const { data, isLoading } = useGetCurrencyQuery();
  const { data: sliderdata } = useGetProductssliderQuery();

  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const currency = data?.[0]?.currency || '';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success('Item removed successfully');
  };

  const handleDecreaseQuantity = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleIncreaseQuantity = (productId) => {
    dispatch(increaseQuantity(productId));
  };

  const getItemPrice = (item) => {
    return Number(item.discountedprice || item.saleprice || 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) =>
        total + getItemPrice(item) * item.quantity,
      0
    );
  };

  const carttotal = getTotalPrice();

  useEffect(() => {
    localStorage.setItem('carttotal', carttotal);
  }, [carttotal]);

  if (isLoading || loading) {
    return (
      <div className="shop-loader">
        <img src={loaderGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* ================= EMPTY CART ================= */}

      {cartItems.length === 0 ? (
        <div className="cart-empty-state">

          <div className="cart-empty-icon">
            <FontAwesomeIcon icon={faShoppingBag} />
          </div>

          <h1>Your Cart Is Empty</h1>

          <p>
            Looks like you haven't added anything to your
            cart yet. Explore our products and find
            something you love.
          </p>

          <Link
            to="/"
            className="cart-primary-button"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Continue Shopping
          </Link>

        </div>
      ) : (

        <>

          {/* ================= PAGE HEADER ================= */}

          <div className="cart-page-heading">

            <div className="cart-heading-content">
              <span className="cart-heading-label">
                YOUR SHOPPING BAG
              </span>

              <h1>Shopping Cart</h1>

              <p>
                You have{' '}
                <strong>{cartItems.length}</strong>{' '}
                {cartItems.length === 1 ? 'item' : 'items'}{' '}
                in your cart
              </p>
            </div>

            <Link
              to="/"
              className="cart-continue-link"
            >
              Continue Shopping
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>

          </div>

          {/* ================= MAIN CONTENT ================= */}

          <div className="cart-main-layout">

            {/* ================= CART ITEMS ================= */}

            <div className="cart-products-area">

              <div className="cart-products-header">
                <h2>Your Items</h2>

                <span>
                  {cartItems.length}{' '}
                  {cartItems.length === 1
                    ? 'Product'
                    : 'Products'}
                </span>
              </div>

              {/* DESKTOP TABLE */}

              <div className="cart-table-container">

                <table className="cart-main-table">

                  <thead>
                    <tr>
                      <th className="cart-th-product">
                        Product
                      </th>

                      <th>Price</th>

                      <th>Quantity</th>

                      <th>Total</th>

                      <th></th>
                    </tr>
                  </thead>

                  <tbody>

                    {cartItems.map((item) => {

                      const price = getItemPrice(item);
                      const itemTotal =
                        price * item.quantity;

                      const hasDiscount =
                        item.discountedprice &&
                        Number(item.discountedprice) !==
                          Number(item.saleprice);

                      return (
                        <tr key={item._id}>

                          {/* PRODUCT */}

                          <td>

                            <div className="cart-product-details">

                              <div className="cart-product-image-box">

                                <img
                                  src={`${backendurl}/uploads/${item.productimage}`}
                                  alt={
                                    item.productname ||
                                    'Product'
                                  }
                                />

                              </div>

                              <div className="cart-product-text">

                                <h3>
                                  {item.productname}
                                </h3>

                                {hasDiscount && (
                                  <span className="cart-discount-badge">
                                    Special Price
                                  </span>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* PRICE */}

                          <td>

                            <div className="cart-price-box">

                              <strong>
                                {price} {currency}
                              </strong>

                              {hasDiscount && (
                                <span>
                                  {item.saleprice}{' '}
                                  {currency}
                                </span>
                              )}

                            </div>

                          </td>

                          {/* QUANTITY */}

                          <td>

                            <div className="cart-quantity-control">

                              <button
                                type="button"
                                onClick={() =>
                                  handleDecreaseQuantity(
                                    item._id
                                  )
                                }
                                disabled={
                                  item.quantity <= 1
                                }
                                aria-label="Decrease quantity"
                              >
                                <FontAwesomeIcon
                                  icon={faMinus}
                                />
                              </button>

                              <span>
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleIncreaseQuantity(
                                    item._id
                                  )
                                }
                                disabled={
                                  item.quantity >=
                                  item.inventory
                                }
                                aria-label="Increase quantity"
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                />
                              </button>

                            </div>

                          </td>

                          {/* ITEM TOTAL */}

                          <td>

                            <strong className="cart-item-total">
                              {itemTotal} {currency}
                            </strong>

                          </td>

                          {/* REMOVE */}

                          <td>

                            <button
                              type="button"
                              className="cart-delete-button"
                              onClick={() =>
                                handleRemoveFromCart(
                                  item._id
                                )
                              }
                              aria-label="Remove product"
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                              />
                            </button>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

              {/* ================= MOBILE CART ================= */}

              <div className="cart-mobile-products">

                {cartItems.map((item) => {

                  const price = getItemPrice(item);
                  const itemTotal =
                    price * item.quantity;

                  const hasDiscount =
                    item.discountedprice &&
                    Number(item.discountedprice) !==
                      Number(item.saleprice);

                  return (
                    <div
                      className="cart-mobile-product"
                      key={item._id}
                    >

                      <div className="cart-mobile-product-top">

                        <div className="cart-mobile-product-image">

                          <img
                            src={`${backendurl}/uploads/${item.productimage}`}
                            alt={
                              item.productname ||
                              'Product'
                            }
                          />

                        </div>

                        <div className="cart-mobile-product-info">

                          <h3>
                            {item.productname}
                          </h3>

                          <strong>
                            {price} {currency}
                          </strong>

                          {hasDiscount && (
                            <span>
                              {item.saleprice}{' '}
                              {currency}
                            </span>
                          )}

                        </div>

                        <button
                          type="button"
                          className="cart-delete-button"
                          onClick={() =>
                            handleRemoveFromCart(
                              item._id
                            )
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                          />
                        </button>

                      </div>

                      <div className="cart-mobile-product-bottom">

                        <div>
                          <small>Quantity</small>

                          <div className="cart-quantity-control">

                            <button
                              type="button"
                              onClick={() =>
                                handleDecreaseQuantity(
                                  item._id
                                )
                              }
                              disabled={
                                item.quantity <= 1
                              }
                            >
                              <FontAwesomeIcon
                                icon={faMinus}
                              />
                            </button>

                            <span>
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleIncreaseQuantity(
                                  item._id
                                )
                              }
                              disabled={
                                item.quantity >=
                                item.inventory
                              }
                            >
                              <FontAwesomeIcon
                                icon={faPlus}
                              />
                            </button>

                          </div>
                        </div>

                        <div className="cart-mobile-item-total">

                          <small>Total</small>

                          <strong>
                            {itemTotal} {currency}
                          </strong>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* CART BOTTOM LINK */}

              <Link
                to="/"
                className="cart-bottom-shopping"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Continue Shopping
              </Link>

            </div>

            {/* ================= ORDER SUMMARY ================= */}

            <aside className="cart-order-summary">

              <div className="cart-summary-heading">
                <h2>Order Summary</h2>

                <span>
                  {cartItems.length}{' '}
                  {cartItems.length === 1
                    ? 'item'
                    : 'items'}
                </span>
              </div>

              <div className="cart-summary-lines">

                <div className="cart-summary-line">
                  <span>Subtotal</span>

                  <strong>
                    {carttotal} {currency}
                  </strong>
                </div>

                <div className="cart-summary-line">
                  <span>Shipping</span>

                  <strong className="cart-free">
                    FREE
                  </strong>
                </div>

              </div>

              <div className="cart-summary-separator" />

              <div className="cart-summary-total-row">

                <span>Total</span>

                <strong>
                  {carttotal} {currency}
                </strong>

              </div>

              <Link
                to="/checkout"
                className="cart-checkout-button"
              >
                Proceed to Checkout

                <FontAwesomeIcon
                  icon={faArrowRight}
                />
              </Link>

              <div className="cart-secure-payment">

                <FontAwesomeIcon icon={faShieldAlt} />

                <div>
                  <strong>Secure Checkout</strong>

                  <span>
                    Your order is safe and secure
                  </span>
                </div>

              </div>

            </aside>

          </div>

          {/* ================= LATEST PRODUCTS ================= */}

          {sliderdata?.length > 0 && (

            <section className="cart-latest-section">

              <div className="cart-latest-heading">

                <span>YOU MAY ALSO LIKE</span>

                <h2>Latest Products</h2>

                <p>
                  Discover more products from our collection
                </p>

              </div>

              <Slider {...settings}>

                {sliderdata.map((product) => (

                  <div
                    className="cart-latest-card"
                    key={product._id}
                  >

                    <Link
                      to={`/product/${product._id}`}
                      className="cart-latest-image"
                    >
                      <img
                        src={`${backendurl}/uploads/${product.productimage}`}
                        alt={
                          product.productname ||
                          'Product'
                        }
                      />
                    </Link>

                    <div className="cart-latest-info">

                      <Link
                        to={`/product/${product._id}`}
                        className="cart-latest-name"
                      >
                        {product.productname}
                      </Link>

                      <strong>
                        {product.saleprice}{' '}
                        {currency}
                      </strong>

                    </div>

                  </div>

                ))}

              </Slider>

            </section>
          )}

        </>
      )}

    </div>
  );
}

export default Cart;
