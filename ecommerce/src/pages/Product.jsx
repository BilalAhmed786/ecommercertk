// Product.jsx
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addToCart } from '../reducers/cartslice';
import { toast } from 'react-toastify';
import Starrate from '../components/Starrate';
import Clientprorating from './Clientprorating';
import ProductSlider from '../components/Productslickslider';
import {
  useGetSingleProductQuery,
  useProductsReviewsMutation,
  useGetProductsreviewsQuery
} from '../app/apiproducts';

function Product() {
  const { id } = useParams();
  const formRef = useRef();
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [formdata, setFormdata] = useState({ name: '', email: '', comment: '' });

  const { data, error, isLoading } = useGetSingleProductQuery(id);
  const { data: proreviews } = useGetProductsreviewsQuery(id);
  const [productreviews] = useProductsReviewsMutation();

  const handleAddToCart = (productId) => {
    toast.success("product added");
    dispatch(addToCart(productId));
  };

  const handleRatingChange = (newRating) => setRating(newRating);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await productreviews({ id, rating, formdata });
      if (result?.data) {
        toast[result.data === 'comment ready for publish' ? 'success' : 'error'](result.data);
        setRating(0);
        setFormdata({ name: '', email: '', comment: '' });
        formRef.current.reset();
      } else {
        console.error('Submission failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='productcontainer'>

      <div className='productwraper'>
        <ProductSlider images={data.galleryimages} />

        <div className='productdetails'>
          <h2>{data.productname}</h2>
          <p>${data.saleprice}</p>
          <p className='prodesc'>{data.productshortdesc}</p>
          <button className='addtocart' onClick={() => handleAddToCart(data._id)}>Add to Cart</button>
        </div>
      </div>

      {/* //Client reviews */}
      {proreviews?.length > 0 && (
        <div className="client-reviews">
          <h4 className="reviews-heading">Client Reviews</h4>
          <p className="avg-rating">
            Average rating: <strong>{(proreviews.reduce((t, r) => t + parseInt(r.rating), 0) / proreviews.length).toFixed(1)}/5</strong>
          </p>
          <p className="total-comments">{proreviews.length} comment{proreviews.length > 1 ? 's' : ''}</p>

          {proreviews.map((review, index) => (
            <div className="review-card" key={index}>
              <p className="reviewer-name">{review.name}</p>
              <Clientprorating rating={review.rating} />
              <p className="review-text">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    {/* // review form */}
    
      <div style={{ marginTop: 35 }} className='reviewform'>
        <form className='formreview' ref={formRef} onSubmit={handleSubmit}>
          <h4>Leave a Review</h4>

          <label><b>Rating:</b></label>
          <Starrate rating={rating} onRatingChange={handleRatingChange} />

          <input
            className='reviewinput'
            type="text"
            name="name"
            placeholder="Your Name"
            onChange={handleInputChange}
          />
          <input
            className='reviewinput'
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleInputChange}
          />
          <textarea
            className='reviewtextarea'
            name="comment"
            rows='5'
            placeholder="Write your review..."
            onChange={handleInputChange}
          />
          <button className='btn btn-danger' type="submit">Submit</button>
        </form>
      </div>


    </div>
  );
}

export default Product;
