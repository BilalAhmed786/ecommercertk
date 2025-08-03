import React, { useState } from 'react';

function Starrate({ rating, onRatingChange }) {
   
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseOver = (index) => {
       
      setHoverRating(index);
    };
  
    const handleMouseLeave = () => {
      setHoverRating(0);
    };
  
    const handleClick = (index) => {
      onRatingChange(index);
    };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          onMouseOver={() => handleMouseOver(index)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index)}
          style={{
            cursor: 'pointer',
            color: (hoverRating || rating) >= index ? 'gold' : 'gray'
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default Starrate