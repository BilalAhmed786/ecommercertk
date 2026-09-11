import React, { useState } from "react";

function Starrate({ rating, onRatingChange }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating-selector">

      {[1, 2, 3, 4, 5].map((index) => {

        const active =
          (hoverRating || rating) >= index;

        return (
          <button
            type="button"
            key={index}
            className={`rating-star ${
              active ? "active" : ""
            }`}
            onMouseEnter={() =>
              setHoverRating(index)
            }
            onMouseLeave={() =>
              setHoverRating(0)
            }
            onClick={() =>
              onRatingChange(index)
            }
            aria-label={`${index} star rating`}
          >
            ★
          </button>
        );
      })}

    </div>
  );
}

export default Starrate;