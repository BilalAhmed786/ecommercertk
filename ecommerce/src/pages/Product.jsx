import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../reducers/cartslice";
import { toast } from "react-toastify";

import Starrate from "../components/Starrate";
import Clientprorating from "./Clientprorating";
import ProductSlider from "../components/Productslickslider";

import {
  useGetSingleProductQuery,
  useProductsReviewsMutation,
  useGetProductsreviewsQuery,
  useGetCurrencyQuery,
} from "../app/apiproducts";

import loaderGif from "../assets/laoder.gif";

function Product() {
  const { id } = useParams();
  const formRef = useRef();

  const dispatch = useDispatch();

  const [rating, setRating] = useState(0);

  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    comment: "",
  });

  const { data, error, isLoading } =
    useGetSingleProductQuery(id);

  const { data: proreviews } =
    useGetProductsreviewsQuery(id);

  const [productreviews] =
    useProductsReviewsMutation();

  const { data: currency = [{ currency: "" }] } =
    useGetCurrencyQuery();

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = (productId) => {
    dispatch(addToCart(productId));
    toast.success("Product added to cart");
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!formdata.name || !formdata.email || !formdata.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await productreviews({
        id,
        rating,
        formdata,
      });

      if (result?.data) {
        if (result.data === "comment ready for publish") {
          toast.success(result.data);

          setRating(0);

          setFormdata({
            name: "",
            email: "",
            comment: "",
          });

          formRef.current?.reset();
        } else {
          toast.error(result.data);
        }
      } else {
        toast.error("Review submission failed");
      }
    } catch (err) {
      toast.error("Unable to submit review");
    }
  };

  if (isLoading || showLoader) {
    return (
      <div className="shop-loader">
        <img
          src={loaderGif}
          alt="Loading..."
         
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <div>
          <span>⚠</span>
          <h3>Unable to load product</h3>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }

  const reviews = proreviews || [];

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (total, review) =>
              total + Number(review.rating || 0),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <main className="product-page">

      {/* =================================================
          PRODUCT
      ================================================= */}

      <section className="product-section">

        <div className="product-gallery">
          <ProductSlider
            images={data?.galleryimages || []}
          />
        </div>

        <div className="product-info">

          <span className="product-label">
            PREMIUM PRODUCT
          </span>

          <h1 className="product-title">
            {data?.productname}
          </h1>

          <div className="product-rating">
            <span className="rating-stars">
              ★★★★★
            </span>

            {reviews.length > 0 && (
              <span className="rating-count">
                {averageRating} ({reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"})
              </span>
            )}
          </div>

          <div className="product-price">
            <span>
              {currency[0]?.currency}
            </span>{" "}
            {data?.saleprice}
          </div>

          <div className="product-divider" />

          <div className="product-description">
            <h3>Product Description</h3>

            <p>
              {data?.productshortdesc}
            </p>
          </div>

          <button
            className="product-cart-button"
            onClick={() =>
              handleAddToCart(data?._id)
            }
          >
            <span className="cart-icon">🛒</span>
            <span>Add to Cart</span>
            <span className="cart-arrow">→</span>
          </button>

          <div className="product-benefits">

            <div className="benefit-item">
              <span className="benefit-icon">
                🚚
              </span>

              <div>
                <strong>Fast Delivery</strong>
                <small>
                  Quick and reliable shipping
                </small>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">
                🔒
              </span>

              <div>
                <strong>Secure Shopping</strong>
                <small>
                  Your information is protected
                </small>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">
                ✓
              </span>

              <div>
                <strong>Trusted Quality</strong>
                <small>
                  Quality products you can trust
                </small>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =================================================
          REVIEWS
      ================================================= */}

      <section className="reviews-section">

        <div className="section-heading">
          <div>
            <span className="section-label">
              CUSTOMER FEEDBACK
            </span>

            <h2>What our customers say</h2>

            <p>
              Real experiences from people who purchased
              this product.
            </p>
          </div>
        </div>


        {reviews.length > 0 ? (

          <div className="reviews-layout">

            {/* REVIEW SUMMARY */}

            <div className="review-summary">

              <div className="average-number">
                {averageRating}
              </div>

              <div className="summary-stars">
                ★★★★★
              </div>

              <p>
                Based on {reviews.length}{" "}
                {reviews.length === 1
                  ? "review"
                  : "reviews"}
              </p>

            </div>


            {/* REVIEW LIST */}

            <div className="review-list">

              {reviews.map((review, index) => (

                <article
                  className="review-card"
                  key={index}
                >

                  <div className="review-top">

                    <div className="review-user">

                      <div className="review-avatar">
                        {review.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>
                        <h4>
                          {review.name}
                        </h4>

                        <span>
                          Verified customer
                        </span>
                      </div>

                    </div>

                    <Clientprorating
                      rating={review.rating}
                    />

                  </div>

                  <p className="review-text">
                    {review.comment}
                  </p>

                </article>

              ))}

            </div>

          </div>

        ) : (

          <div className="no-reviews">
            <div className="no-review-icon">
              ★
            </div>

            <h3>No reviews yet</h3>

            <p>
              Be the first customer to share your
              experience.
            </p>
          </div>

        )}

      </section>


      {/* =================================================
          REVIEW FORM
      ================================================= */}

      <section className="review-form-section">

        <div className="review-form-card">

          <div className="review-form-intro">

            <span className="section-label">
              SHARE YOUR EXPERIENCE
            </span>

            <h2>
              Leave a review
            </h2>

            <p>
              Tell other customers what you think
              about this product.
            </p>

          </div>


          <form
            className="modern-review-form"
            ref={formRef}
            onSubmit={handleSubmit}
          >

            <div className="rating-field">

              <label>
                Your Rating
              </label>

              <div className="rating-selector">

                <Starrate
                  rating={rating}
                  onRatingChange={
                    handleRatingChange
                  }
                />

                <span className="rating-hint">
                  {rating
                    ? `${rating} out of 5`
                    : "Select a rating"}
                </span>

              </div>

            </div>


            <div className="review-form-grid">

              <div className="form-field">

                <label htmlFor="review-name">
                  Your Name
                </label>

                <input
                  id="review-name"
                  className="modern-review-input"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formdata.name}
                  onChange={handleInputChange}
                  required
                />

              </div>


              <div className="form-field">

                <label htmlFor="review-email">
                  Email Address
                </label>

                <input
                  id="review-email"
                  className="modern-review-input"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formdata.email}
                  onChange={handleInputChange}
                  required
                />

              </div>

            </div>


            <div className="form-field">

              <label htmlFor="review-comment">
                Your Review
              </label>

              <textarea
                id="review-comment"
                className="modern-review-textarea"
                name="comment"
                rows="5"
                placeholder="Write your experience with this product..."
                value={formdata.comment}
                onChange={handleInputChange}
                required
              />

            </div>


            <button
              className="review-submit-button"
              type="submit"
            >
              <span>Submit Review</span>
              <span>→</span>
            </button>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Product;