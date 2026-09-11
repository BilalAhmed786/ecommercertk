import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faMinus,
  faPlus,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
  decreaseQuantity,
  removeFromCart,
  increaseQuantity,
} from "../reducers/cartslice";
import { useGetCurrencyQuery } from "../app/apiproducts";
import { Link } from "react-router-dom";
import { backendurl } from "../baseurl/baseurl";
function Cartpreview() {
  const { data } = useGetCurrencyQuery();
  const cartItems = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const currency = data?.[0]?.currency || "";
  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
    toast.success("Item removed successfully");
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
      (total, item) => total + getItemPrice(item) * item.quantity,
      0,
    );
  };
  if (cartItems.length === 0) {
    return (
      <div className="cartpreview-empty">
        {" "}
        <div className="cartpreview-empty-icon">
          {" "}
          <FontAwesomeIcon icon={faShoppingBag} />{" "}
        </div>{" "}
        <h3>Your cart is empty</h3>{" "}
        <p>Add some products to your cart and they will appear here.</p>{" "}
        <Link to="/" className="cartpreview-shop-btn">
          {" "}
          Start Shopping{" "}
        </Link>{" "}
      </div>
    );
  }
  return (
    <div className="cartpreview-wrapper">
      {" "}
      <div className="cartpreview-header">
        {" "}
        <div>
          {" "}
          <h3>Shopping Cart</h3>{" "}
          <span>
            {" "}
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      <div className="cartpreview-items">
        {" "}
        {cartItems.map((item) => {
          const price = getItemPrice(item);
          return (
            <div className="cartpreview-item" key={item._id}>
              {" "}
              <div className="cartpreview-product-image">
                {" "}
                <img
                  src={`${backendurl}/uploads/${item.productimage}`}
                  alt={item.productname || "Product"}
                />{" "}
              </div>{" "}
              <div className="cartpreview-product-info">
                {" "}
                <h4>{item.productname}</h4>{" "}
                <div className="cartpreview-price">
                  {" "}
                  {price} {currency}{" "}
                </div>{" "}
                <div className="cartpreview-bottom">
                  {" "}
                  <div className="cartpreview-quantity">
                    {" "}
                    <button
                      type="button"
                      onClick={() => handleDecreaseQuantity(item._id)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      {" "}
                      <FontAwesomeIcon icon={faMinus} />{" "}
                    </button>{" "}
                    <span>{item.quantity}</span>{" "}
                    <button
                      type="button"
                      onClick={() => handleIncreaseQuantity(item._id)}
                      disabled={item.quantity >= item.inventory}
                      aria-label="Increase quantity"
                    >
                      {" "}
                      <FontAwesomeIcon icon={faPlus} />{" "}
                    </button>{" "}
                  </div>{" "}
                  <button
                    type="button"
                    className="cartpreview-remove"
                    onClick={() => handleRemoveFromCart(item._id)}
                    aria-label={`Remove ${item.productname}`}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faTrashAlt} />{" "}
                  </button>{" "}
                </div>{" "}
              </div>{" "}
            </div>
          );
        })}{" "}
      </div>{" "}
      <div className="cartpreview-footer">
        {" "}
        <div className="cartpreview-total">
          {" "}
          <span>Total</span>{" "}
          <strong>
            {" "}
            {getTotalPrice()} {currency}{" "}
          </strong>{" "}
        </div>{" "}
        <div className="cartpreview-actions">
          {" "}
          <Link to="/cart" className="cartpreview-view-btn">
            {" "}
            View Cart{" "}
          </Link>{" "}
          <Link to="/checkout" className="cartpreview-checkout-btn">
            {" "}
            Checkout{" "}
          </Link>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export default Cartpreview;
