import React, { useEffect, useState } from 'react';
import {
  useGetProductDataQuery,
  useGetProductCategeroyQuery,
  useGetCurrencyQuery,
} from '../app/apiproducts';
import { Link, useNavigate } from 'react-router-dom';
import { addProducts } from '../reducers/cartslice';
import { useDispatch } from 'react-redux';
import Sidebar from '../components/sidebar';
import { backendurl } from '../baseurl/baseurl';

const ShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [productFilter, setProductFilter] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState([]);
  const [productcat, setCategory] = useState('');
  const [saleprice, setPrice] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  

  const { data: procat } = useGetProductCategeroyQuery('');
  const { data: currency = [{ currency: '' }] } = useGetCurrencyQuery();

  const {
    data: fetchedProducts = [],
    isFetching,
    refetch,
  } = useGetProductDataQuery({
    page,
    pageSize: 4,
    saleprice,
    productcat,
    productFilter,
  });

  // Append new products or replace list on first page
  useEffect(() => {
    if (page === 1) {
      setProducts(fetchedProducts);
    } else {
      setProducts((prev) => [...prev, ...fetchedProducts]);
    }

    setHasMore(fetchedProducts.length > 0);
  }, [fetchedProducts]);

  // Infinite scroll trigger
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

  // Dispatch products to Redux
  useEffect(() => {
    dispatch(addProducts(products));
  }, [products]);

  // Reset page on filter change
  const handleFiltersChange = () => {
    setPage(1);
  };

  return (
    <div className='shopcontainer'>
     < Sidebar 
       setCategory={setCategory} 
       setPrice={setPrice} 
       setProductFilter={setProductFilter}
       productcat={productcat}
       procat={procat}
       handleFiltersChange={handleFiltersChange}
       setIsOpen={setIsOpen}
       isOpen={isOpen}
       />
      <div className='product-container'>
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`product-display ${page > 1 ? 'new-product' : ''}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Link to={`/product/${product._id}`}>
              {product.discountedprice && (
                <div className='badge'>
                  <span className='badge-text'>
                    {(
                      ((product.saleprice - product.discountedprice) / product.saleprice) *
                      100
                    ).toFixed(0)}
                    % off
                  </span>
                </div>
              )}
              <div className='image-wrapper'>
                <img
                  src={`${backendurl}/uploads/${product.galleryimages[0]}`}
                  className='product-image'
                  alt={product.productname}
                />
                <img
                  src={`${backendurl}/uploads/${product.productimage}`}
                  className='gallery-image'
                  alt={product.productname}
                />
              </div>
            </Link>
            <p className='product-name'>{product.productname}</p>
            {product.discountedprice ? (
              <div className='discountprice'>
                <s>
                  <p>
                    {currency[0]?.currency} {product.saleprice}
                  </p>
                </s>
                <p className='discounted'>
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
        {isFetching && <p style={{ textAlign: 'center' }}>Loading...</p>}
        {!hasMore && <p style={{ textAlign: 'center' }}>No more products</p>}
      </div>
    </div>
  );
};

export default ShopPage;
