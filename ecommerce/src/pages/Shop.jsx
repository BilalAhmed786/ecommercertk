import React, { useEffect, useState, useRef } from "react";
import {
  useGetProductDataQuery,
  useGetProductCategeroyQuery,
  useGetCurrencyQuery,
} from "../app/apiproducts";
import { useGetRangeQuery } from "../app/productfilter";
import { Link } from "react-router-dom";
import { addProducts } from "../reducers/cartslice";
import { useDispatch } from "react-redux";
import { backendurl } from "../baseurl/baseurl";
import loaderGif from "../assets/laoder.gif";

const ShopPage = () => {
  const dispatch = useDispatch();

  const [productFilter, setProductFilter] = useState("");
  const [productcat, setCategory] = useState("");
  const [saleprice, setPrice] = useState("");

  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const scrollRef = useRef(false);

  // Categories
  const { data: procat } = useGetProductCategeroyQuery("");

  // Price ranges
  const { data: priceRanges } = useGetRangeQuery();

  // Currency
  const { data: currency = [{ currency: "" }] } =
    useGetCurrencyQuery();

  // Products
  const {
    data: fetchedProducts = [],
    isFetching,
    isSuccess,
  } = useGetProductDataQuery({
    page,
    pageSize: 8,
    saleprice,
    productcat,
    productFilter,
  });

  /* ===============================
     INITIAL LOADING
  =============================== */

  useEffect(() => {
    if (!isFetching) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isFetching]);


  /* ===============================
     SCROLL TOP
  =============================== */

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  /* ===============================
     PRODUCTS
  =============================== */

  useEffect(() => {
    if (!isSuccess) return;

    if (page === 1) {
      setProducts(fetchedProducts);
    } else {
      setProducts((prev) => [
        ...prev,
        ...fetchedProducts.filter(
          (product) =>
            !prev.some(
              (prevProduct) =>
                prevProduct._id === product._id
            )
        ),
      ]);
    }

    // pageSize is 8
    setHasMore(fetchedProducts.length === 8);

  }, [
    fetchedProducts,
    page,
    isSuccess,
  ]);


  /* ===============================
     INFINITE SCROLL
  =============================== */

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight =
        document.documentElement.scrollHeight;

      if (
        scrollTop + viewportHeight >= fullHeight * 0.65 &&
        !isFetching &&
        hasMore
      ) {
        if (!scrollRef.current) {
          scrollRef.current = true;

          setPage((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, [isFetching, hasMore]);


  /* ===============================
     RESET SCROLL LOCK
  =============================== */

  useEffect(() => {
    if (!isFetching) {
      scrollRef.current = false;
    }
  }, [isFetching]);


  /* ===============================
     CART
  =============================== */

  useEffect(() => {
    dispatch(addProducts(products));
  }, [products, dispatch]);


  /* ===============================
     FILTER HANDLERS
  =============================== */

  const handleSearchChange = (e) => {
    setProductFilter(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    setPage(1);
    setHasMore(true);
  };

  const clearFilters = () => {
    setProductFilter("");
    setCategory("");
    setPrice("");

    setPage(1);
    setHasMore(true);
  };


  /* ===============================
     LOADER
  =============================== */

  if (initialLoading) {
    return (
      <div className="shop-loader">
        <img
          src={loaderGif}
          alt="Loading..."
        />
      </div>
    );
  }


  return (
    <div className="shop-page">

      {/* ===============================
          HEADER
      =============================== */}

      <section className="shop-header">

        <div className="shop-header-inner">

          <span className="shop-eyebrow">
            OUR COLLECTION
          </span>

          <h1>
            Shop Our Products
          </h1>

          <p>
            Discover our latest collection and
            find something perfect for you.
          </p>

        </div>

      </section>


      {/* ===============================
          FILTERS
      =============================== */}

      <section className="shop-filter-section">

        <div className="shop-filter-bar">

          {/* SEARCH */}

          <div className="shop-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              value={productFilter}
              placeholder="Search products..."
              onChange={handleSearchChange}
            />

          </div>


          {/* CATEGORY */}

          <div className="shop-filter">

            <label>
              Category
            </label>

            <select
              value={productcat}
              onChange={handleCategoryChange}
            >

              <option value="">
                All Categories
              </option>

              {procat?.map((cat, index) => (
                <option
                  key={index}
                  value={cat.productcat}
                >
                  {cat.productcat}
                </option>
              ))}

            </select>

          </div>


          {/* PRICE */}

          <div className="shop-filter">

            <label>
              Price
            </label>

            <select
              value={saleprice}
              onChange={handlePriceChange}
            >

              <option value="">
                All Prices
              </option>

              {priceRanges?.map((range, index) => (
                <option
                  key={index}
                  value={range.range}
                >
                  {range.range}
                </option>
              ))}

            </select>

          </div>


          {/* CLEAR */}

          {(productFilter ||
            productcat ||
            saleprice) && (

            <button
              className="clear-filter"
              onClick={clearFilters}
            >
              Clear
            </button>

          )}

        </div>

      </section>


      {/* ===============================
          PRODUCTS
      =============================== */}

      <main className="shop-products">

        <div className="shop-products-header">

          <div>

            <span>
              COLLECTION
            </span>

            <h2>
              Explore Products
            </h2>

          </div>

          <p>
            {products.length} products
          </p>

        </div>


        <div className="product-container">

          {products.map((product, index) => (

            <div
              key={product._id}
              className="product-display"
              style={{
                animationDelay:
                  `${index * 50}ms`,
              }}
            >

              <Link
                to={`/product/${product._id}`}
                className="product-link"
              >

                <div className="image-wrapper">

                  {/* DISCOUNT */}

                  {product.discountedprice && (
                    <span className="badge">

                      {(
                        (
                          (product.saleprice -
                            product.discountedprice) /
                          product.saleprice
                        ) * 100
                      ).toFixed(0)}

                      % OFF

                    </span>
                  )}


                  {/* FIRST IMAGE */}

                  <img
                    src={`${backendurl}/uploads/${product.galleryimages?.[0]}`}
                    className="product-image"
                    alt={product.productname}
                  />


                  {/* SECOND IMAGE */}

                  <img
                    src={`${backendurl}/uploads/${product.productimage}`}
                    className="gallery-image"
                    alt={product.productname}
                  />


                  {/* VIEW */}

                  <span className="view-product">
                    View Product →
                  </span>

                </div>


                {/* INFO */}

                <div className="product-info">

                  <div className="product-title-row">

                    <p className="product-name">
                      {product.productname}
                    </p>

                    <span className="product-arrow">
                      ↗
                    </span>

                  </div>


                  {/* PRICE */}

                  {product.discountedprice ? (

                    <div className="discountprice">

                      <span className="old-price">
                        {currency[0]?.currency}{" "}
                        {product.saleprice}
                      </span>

                      <span className="discounted">
                        {currency[0]?.currency}{" "}
                        {product.discountedprice}
                      </span>

                    </div>

                  ) : (

                    <p className="normal-price">
                      {currency[0]?.currency}{" "}
                      {product.saleprice}
                    </p>

                  )}

                </div>

              </Link>

            </div>

          ))}

        </div>


        {/* LOADING NEXT PAGE */}

        {isFetching && page > 1 && (
          <div className="shop-loading-more">
            Loading more products...
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="shop-end-message">
            No more products
          </div>
        )}

      </main>

    </div>
  );
};

export default ShopPage;