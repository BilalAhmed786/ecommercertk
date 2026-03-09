import React, { useEffect, useState } from 'react';
import {
  useGetProductDataQuery,
  useGetProductCategeroyQuery,
  useGetCurrencyQuery,
} from '../app/apiproducts';
import { Link } from 'react-router-dom';
import { addProducts } from '../reducers/cartslice';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/sidebar';
import { backendurl } from '../baseurl/baseurl';
import loaderGif from '../assets/laoder.gif';

const ShopPage = () => {
  const dispatch = useDispatch();

  const [productFilter, setProductFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState([]);
  const [productcat, setCategory] = useState('');
  const [saleprice, setPrice] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);

  const { data: procat } = useGetProductCategeroyQuery('');
  const { data: currency = [{ currency: '' }] } = useGetCurrencyQuery();

  const {
    data: fetchedProducts = [],
    isFetching,
  } = useGetProductDataQuery({
    page,
    pageSize: 4,
    saleprice,
    productcat,
    productFilter,
  });

  // ⏱ Minimum loader delay (1.5s)
  useEffect(() => {
    if (!isFetching) {
      const timer = setTimeout(() => {
        setInitialLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isFetching]);

  // Disable scroll while loading
  useEffect(() => {
    document.body.style.overflow = initialLoading ? 'hidden' : 'auto';
  }, [initialLoading]);

  // Append or replace products
  useEffect(() => {
    if (page === 1) {
      setProducts(fetchedProducts);
    } else {
      setProducts((prev) => [...prev, ...fetchedProducts]);
    }

    setHasMore(fetchedProducts.length > 0);
  }, [fetchedProducts,page]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300 &&
        !isFetching &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFetching, hasMore]);

  // Sync with Redux
  useEffect(() => {
    dispatch(addProducts(products));
  }, [products,dispatch]);

  const handleFiltersChange = () => {
    setPage(1);
  };

  // 🔹 FULL SCREEN LOADER
  if (initialLoading) {
    return (
      <div className="shop-loader">
        <img src={loaderGif} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="shopcontainer">
      <Sidebar
        setCategory={setCategory}
        setPrice={setPrice}
        setProductFilter={setProductFilter}
        productcat={productcat}
        procat={procat}
        handleFiltersChange={handleFiltersChange}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      />

      <div className="product-container">
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`product-display ${page > 1 ? 'new-product' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link to={`/product/${product._id}`}>
              {product.discountedprice && (
                <div className="badge">
                  <span className="badge-text">
                    {(
                      ((product.saleprice - product.discountedprice) /
                        product.saleprice) *
                      100
                    ).toFixed(0)}
                    % off
                  </span>
                </div>
              )}

              <div className="image-wrapper">
                <img
                  src={`${backendurl}/uploads/${product.galleryimages[0]}`}
                  className="product-image"
                  alt={product.productname}
                />
                <img
                  src={`${backendurl}/uploads/${product.productimage}`}
                  className="gallery-image"
                  alt={product.productname}
                />
              </div>
            </Link>

            <p className="product-name">{product.productname}</p>

            {product.discountedprice ? (
              <div className="discountprice">
                <s>
                  <p>
                    {currency[0]?.currency} {product.saleprice}
                  </p>
                </s>
                <p className="discounted">
                  {currency[0]?.currency} {product.discountedprice}
                </p>
              </div>
            ) : (
              <p>
                {currency[0]?.currency} {product.saleprice}
              </p>
            )}
          </div>
        ))}

       
      </div>
    </div>
  );
};

export default ShopPage;